package com.nexests.nexests.service;

import com.nexests.nexests.model.UserModel;
import com.nexests.nexests.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserModel userdata = userRepository.findByUsername(username).orElse(null);
        if (userdata == null) throw new UsernameNotFoundException("USER NOT FOUND");


        UserDetails user = User.builder()
                .username(userdata.getUsername())
                .password(userdata.getPassword())
                .roles(String.valueOf(userdata.getRole()))
                .build();

        return user;
    }
}
