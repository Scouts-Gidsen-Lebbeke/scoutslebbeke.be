<?php

enum BranchStatus: string {
    // Active branches requiring a membership and currently having activities
    case ACTIVE = "ACTIVE";
    // Active branches requiring a membership, but no predefined activities
    case MEMBER = "MEMBER";
    // Active branches not requiring a membership
    case PASSIVE = "PASSIVE";
    // Inactive branch without current members
    case HIDDEN = "HIDDEN";
}
