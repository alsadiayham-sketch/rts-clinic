!macro customHeader
  BrandingText "RTS Clinic Setup"
!macroend

!macro customWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Welcome to RTS Clinic"
  !define MUI_WELCOMEPAGE_TEXT "Install RTS Clinic to manage clinics, patients, sessions, payments, insurance, and billing."
!macroend

!macro customFinishPage
  !define MUI_FINISHPAGE_TITLE "RTS Clinic Installed"
  !define MUI_FINISHPAGE_TEXT "RTS Clinic is ready to use."
  !define MUI_FINISHPAGE_RUN "$INSTDIR\RTS Clinic.exe"
  !define MUI_FINISHPAGE_RUN_TEXT "Launch RTS Clinic now"
!macroend
