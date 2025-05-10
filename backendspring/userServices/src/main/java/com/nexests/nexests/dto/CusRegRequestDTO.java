package com.nexests.nexests.dto;

import com.nexests.nexests.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CusRegRequestDTO {
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String location;
    private String password;
    private Role role;
}
