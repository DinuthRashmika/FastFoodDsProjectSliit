package com.nexests.nexests.dto;

import com.nexests.nexests.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CusRegResponseDTO {
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String location;
    private Role role;
    private String message;
}
