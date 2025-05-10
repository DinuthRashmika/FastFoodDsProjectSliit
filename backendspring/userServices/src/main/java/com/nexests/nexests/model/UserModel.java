package com.nexests.nexests.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_info")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String fullName;
    @Column(unique = true)
    private String username;
    private String email;
    private String phoneNumber;
    private String location;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;



}
