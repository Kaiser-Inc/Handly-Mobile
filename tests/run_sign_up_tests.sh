#!/bin/bash

maestro test \
  sign_up/CT001_successful_registration.yaml \
  sign_up/CT002_valid_name_with_minimum_length.yaml \
  sign_up/CT003_valid_name_with_maximum_length.yaml \
  sign_up/CT004_invalid_name_with_minimum_length.yaml \
  sign_up/CT005_name_invalid_with_maximum_length.yaml \
  sign_up/CT006_name_only_with_letters_and_spaces.yaml \
  sign_up/CT007_name_only_with_spaces.yaml \
  sign_up/CT008_name_with_numbers.yaml \
  sign_up/CT009_name_with_special_characters.yaml \
  sign_up/CT010_empty_name.yaml \
  sign_up/CT011_email_valid_with_maximum_length.yaml \
  sign_up/CT012_email_invalid_with_maximum_length.yaml \
  sign_up/CT013_email_with_valid_subdomain.yaml \
  sign_up/CT014_email_missing_separator.yaml \
  sign_up/CT015_email_with_multiple_separators.yaml \
  sign_up/CT016_email_missing_dot.yaml \
  sign_up/CT017_email_only_with_spaces.yaml \
  sign_up/CT018_empty_email.yaml \
  sign_up/CT019_email_already_registered.yaml \
  sign_up/CT020_password_valid_with_minimum_length.yaml \
  sign_up/CT021_password_valid_with_maximum_length.yaml \
  sign_up/CT022_password_invalid_with_minimum_length.yaml \
  sign_up/CT023_password_invalid_with_maximum_length.yaml \
  sign_up/CT024_password_with_letters_and_numbers.yaml \
  sign_up/CT025_password_only_numeric.yaml \
  sign_up/CT026_password_only_alphabetic.yaml \
  sign_up/CT027_password_only_special_characters.yaml \
  sign_up/CT028_password_only_spaces.yaml \
  sign_up/CT029_empty_password.yaml \
  sign_up/CT030_cpf_valid.yaml \
  sign_up/CT031_cpf_invalid_minimum.yaml \
  sign_up/CT032_cpf_invalid_maximum.yaml \
  sign_up/CT033_cpf_with_letters.yaml \
  sign_up/CT034_cpf_with_special_characters.yaml \
  sign_up/CT035_cpf_already_registered.yaml \
  sign_up/CT036_empty_cpf.yaml \
  sign_up/CT037_cnpj_valid.yaml \
  sign_up/CT038_cnpj_invalid_minimum.yaml \
  sign_up/CT039_cnpj_invalid_maximum.yaml \
  sign_up/CT040_cnpj_with_letters.yaml \
  sign_up/CT041_cnpj_with_special_characters.yaml \
  sign_up/CT042_cnpj_already_registered.yaml \
  sign_up/CT043_empty_cnpj.yaml \
  --format html \
  --output report_tests_sign_up.html