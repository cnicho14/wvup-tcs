﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace tcs_service.Models
{
    public class Reason
    {
        [Key]
        [InverseProperty(nameof(SignInReason.Reason))]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public bool Deleted { get; set; }
    }
}