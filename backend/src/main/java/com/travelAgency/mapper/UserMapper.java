package com.travelAgency.mapper;

import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.UserDTO;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper {

  UserDTO toUserDTO(User user);
}
