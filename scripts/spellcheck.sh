#!/bin/bash
set -e

log_scope="[spell-check]"
warnings=$(npx spellchecker -f $1 | grep 'warning' | sed '/^[[:space:]]*$/d' || true)

# echo all warnings if more than a single line foud
if (( "${#warnings[@]}" > 1)); then
  printf "%s\n" "${log_scope} Possible spelling errors found in commit message:" "${warnings[@]}"

  if [[ -t 1 ]]; then
  exec < /dev/tty

    while true; do
      read -p "${log_scope} Proceed anyway? (y/n) " yn
      if [[ "$yn" = "" ]]; then
        yn='y'
      fi
      case $yn in
          [Yy] ) break;;
          [Nn] ) echo "${log_scope} Abort" >&2; exit 1;;
          * ) echo "Please answer y for yes or n for no.";;
      esac
    done
  else
    echo "${log_scope} Failing since not running interactively." >&2; exit 1;
  fi
fi