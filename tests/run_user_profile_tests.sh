#!/bin/bash

maestro test \
  user_profile/CT089_view_user_profile.yaml \
  user_profile/CT090_update_profile_name.yaml \
  user_profile/CT091_update_valid_name_with_minimum_size.yaml \
  user_profile/CT092_update_valid_name_with_maximum_size.yaml \
  user_profile/CT093_update_invalid_name_with_minimum_size.yaml \
  user_profile/CT094_update_invalid_name_with_maximum_size.yaml \
  user_profile/CT095_update_profile_name_with_numbers.yaml \
  user_profile/CT096_update_profile_name_with_special_characters.yaml \
  user_profile/CT097_update_profile_name_with_only_spaces.yaml \
  user_profile/CT098_update_profile_name_empty.yaml \
  --format html \
  --output report_tests_user_profile.html
