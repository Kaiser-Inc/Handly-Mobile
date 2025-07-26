#!/bin/bash

maestro test \
  services/create/CT053_successful_service_creation.yaml \
  services/create/CT054_service_creation_with_valid_name.yaml \
  services/create/CT055_service_creation_with_maximum_valid_name.yaml \
  services/create/CT056_service_creation_with_minimum_valid_name.yaml \
  services/create/CT057_service_creation_with_maximum_invalid_name.yaml \
  services/create/CT058_service_creation_with_minimum_invalid_name.yaml \
  services/create/CT059_service_creation_with_numbers_in_name.yaml \
  services/create/CT060_service_creation_with_special_characters_in_name.yaml \
  services/create/CT061_service_creation_with_only_spaces_in_name.yaml \
  services/create/CT062_service_creation_with_empty_name.yaml \
  services/create/CT063_service_creation_with_valid_category.yaml \
  services/create/CT064_service_creation_with_numbers_in_category.yaml \
  services/create/CT065_service_creation_with_special_characters_in_category.yaml \
  services/create/CT066_service_creation_with_only_spaces_in_category.yaml \
  services/create/CT067_service_creation_with_empty_category.yaml \
  services/create/CT068_service_creation_with_valid_description.yaml \
  services/create/CT069_service_creation_with_maximum_valid_description.yaml \
  services/create/CT070_service_creation_with_minimum_valid_description.yaml \
  services/create/CT071_service_creation_with_maximum_invalid_description.yaml \
  services/create/CT072_service_creation_with_minimum_invalid_description.yaml \
  services/create/CT073_service_creation_with_empty_description.yaml \
  services/create/CT074_service_creation_with_valid_image.yaml \
  services/create/CT075_service_creation_with_empty_image.yaml \
  --format html \
  --output report_tests_services_create.html
