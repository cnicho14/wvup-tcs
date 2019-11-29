import React from 'react';
import { CSVLink } from 'react-csv';
import { clone } from 'ramda';
import { Router } from '@reach/router';
import { ReportLayout, Table, Header, Card, PieChart } from '../../ui';
import StartToEndDateForm from '../../components/StartToEndDateForm';
import LoadingContent from '../../components/LoadingContent';
import useApiWithHeaders from '../../hooks/useApiWithHeaders';

// take all reasons and split up into reason groups
const filterReason = reason => element => element.reasonName === reason;

// reducer to give reason, filter by reason
const reasonForVisitingToReasonsReducer = (acc, reasonForVisiting) => {
  const found = acc.find(element => element === reasonForVisiting.reasonName);
  if (found) return acc;
  acc.push(reasonForVisiting.reasonName);
  return acc;
};

const reasonTotalStudentReducer = (acc, reason) => {
  // reason already in acc, add to totalStudents
  const index = acc.findIndex(filterReason(reason.reasonName));
  if (index !== -1) {
    acc[index].visits += reason.visits;
  } else {
    acc.push(clone(reason));
  }
  return acc;
};

type Props = {
  navigate: any,
  '*': string
};

const ReasonsReport = ({ navigate, '*': unMatchedUri }: Props) => {
  const [start, end] = unMatchedUri.split('/');
  return (
    <ReportLayout>
      <StartToEndDateForm
        title="Reason For Visiting Report"
        style={{ gridArea: 'form' }}
        initialValues={{
          startDate: start,
          endDate: end
        }}
        onSubmit={({ startDate, endDate }) => {
          return Promise.resolve(navigate(`${startDate}/${endDate}`));
        }}
      />
      <Router primary={false} component={({ children }) => <>{children}</>}>
        {/* $FlowFixMe */}
        <ReasonsResult path=":startDate/:endDate" />
      </Router>
    </ReportLayout>
  );
};

type ReasonsResultProps = {
  startDate: string,
  endDate: string
};

const ReasonsResult = ({ startDate, endDate }: ReasonsResultProps) => {
  const [loading, data, errors] = useApiWithHeaders(
    `reports/reasons?start=${startDate}&end=${endDate}`
  );
  return (
    <LoadingContent loading={loading} data={data} errors={errors}>
      <Card width="600px" style={{ gridArea: 'chart' }}>
        <PieChart
          title="Reason For Visiting Percentages"
          data={data.body.reduce(reasonTotalStudentReducer, [])}
          x={d => d.reasonName}
          y={d => d.visits}
        />
      </Card>
      <Card width="900px" style={{ gridArea: 'table' }}>
        <Header align="center">
          Reason for Visiting Summary -{' '}
          <CSVLink data={data.body} filename="reasonForVisiting">
            Download All Data
          </CSVLink>
        </Header>
        {data.body.reduce(reasonForVisitingToReasonsReducer, []).map(reason => (
          <ReasonsTable
            key={reason}
            name={reason}
            reasons={data.body.filter(filterReason(reason))}
          />
        ))}
      </Card>
    </LoadingContent>
  );
};

const ReasonsTable = ({ reasons, name }) => {
  return (
    <Table>
      <caption>
        <Header type="h3">
          {name} -{' '}
          <CSVLink data={reasons} filename={`${name}`}>
            Download
          </CSVLink>
        </Header>
      </caption>
      <thead align="left">
        <tr>
          <th>Course</th>
          <th>CRN</th>
          <th>Total Students Visited</th>
        </tr>
      </thead>
      <tbody>
        {reasons.map(reason => (
          <tr key={reason.courseName + reason.reasonName}>
            <td>{reason.courseName}</td>
            <td>{reason.courseCRN}</td>
            <td>{reason.visits}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ReasonsReport;
