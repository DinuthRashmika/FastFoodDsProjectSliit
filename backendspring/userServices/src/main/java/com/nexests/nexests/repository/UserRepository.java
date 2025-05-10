package com.nexests.nexests.repository;

import com.nexests.nexests.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {


    Optional<UserModel> findByUsername(String  username);

    boolean existsByEmail(String email);


    List<UserModel> id(Integer id);
}
