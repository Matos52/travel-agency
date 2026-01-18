package com.travelAgency.mapper;

import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.user.UserDTO;
import com.travelAgency.db.repository.projection.UserWithRatingCount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserDTO toUserDTO(User user);

  UserDTO toUserDTOWithRating(UserWithRatingCount user);
}
