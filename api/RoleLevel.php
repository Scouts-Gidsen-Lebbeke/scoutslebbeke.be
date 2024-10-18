<?php

enum RoleLevel: int {

    // The almighty and all-powerful, better than God
    case ADMIN = 4;
    // Staff member of this group
    case STAFF = 3;
    // Paying member of this group
    case MEMBER = 2;
    // Valid login at SGV
    case SCOUT = 1;
    // Anyone
    case GUEST = 0;

    function isAdmin(): bool {
        return $this == RoleLevel::ADMIN;
    }

    function isStaff(): bool {
        return $this->value >= RoleLevel::STAFF->value;
    }

    function isMember(): bool {
        return $this->value >= RoleLevel::MEMBER->value;
    }

    function isScout(): bool {
        return $this->value >= RoleLevel::SCOUT->value;
    }

}

function highest_level($params): RoleLevel {
    if (empty($params)) {
        return RoleLevel::SCOUT;
    }
    return RoleLevel::from(max(array_map(fn ($p) => (RoleLevel::tryFrom($p) ?? RoleLevel::SCOUT)->value, $params)));
}