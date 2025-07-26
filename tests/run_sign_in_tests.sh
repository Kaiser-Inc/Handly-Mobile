#!/bin/bash

maestro test \
  sign_in/CT044_login_with_valid_credentials.yaml \
  sign_in/CT045_login_with_valid_email.yaml \
  sign_in/CT046_login_with_unregistered_email.yaml \
  sign_in/CT047_login_with_email_without_at_symbol.yaml \
  sign_in/CT048_login_with_email_with_multiple_at_symbols.yaml \
  sign_in/CT049_login_with_missing_dot_in_email.yaml \
  sign_in/CT050_login_with_email_containing_only_spaces.yaml \
  sign_in/CT051_login_with_valid_password.yaml \
  sign_in/CT052_login_with_empty_password_field.yaml \
  --format html \
  --output report_tests_sign_in.html
