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
public class LoginResponseDTO {
    private String username;
    private String token;
    private Role role;
    private String error;
    private String message;

}
