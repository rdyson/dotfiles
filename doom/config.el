;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

(setq user-full-name "Rob Dyson"
      user-mail-address "rob@rdyson.dev")

(setq doom-theme 'doom-dracula)

(setq exec-path (append exec-path '("/usr/local/bin")))

(setq deft-directory "~/Dropbox/Notes")
(setq deft-use-filename-as-title t)

;; (require 'org-mime)

(add-to-list 'load-path "/usr/local/share/emacs/site-lisp/mu4e/")
(require 'mu4e)

(setq mu4e-maildir (expand-file-name "~/Maildir"))

; get mail
(setq mu4e-get-mail-command "mbsync -c ~/.emacs.d/mu4e/.mbsyncrc -a"
  ;; mu4e-html2text-command "w3m -T text/html" ;;using the default mu4e-shr2text
  mu4e-view-prefer-html t
  mu4e-update-interval 180
  mu4e-headers-auto-update t
  mu4e-compose-signature-auto-include nil
  mu4e-compose-format-flowed t)

;; to view selected message in the browser, no signin, just html mail
(add-to-list 'mu4e-view-actions
  '("ViewInBrowser" . mu4e-action-view-in-browser) t)

;; enable inline images
(setq mu4e-view-show-images t)
;; use imagemagick, if available
(when (fboundp 'imagemagick-register-types)
  (imagemagick-register-types))

;; every new email composition gets its own frame!
(setq mu4e-compose-in-new-frame t)

;; don't save message to Sent Messages, IMAP takes care of this
(setq mu4e-sent-messages-behavior 'delete)

(add-hook 'mu4e-view-mode-hook #'visual-line-mode)

;; <tab> to navigate to links, <RET> to open them in browser
(add-hook 'mu4e-view-mode-hook
  (lambda()
;; try to emulate some of the eww key-bindings
(local-set-key (kbd "<RET>") 'mu4e~view-browse-url-from-binding)
(local-set-key (kbd "<tab>") 'shr-next-link)
(local-set-key (kbd "<backtab>") 'shr-previous-link)))

;; from https://www.reddit.com/r/emacs/comments/bfsck6/mu4e_for_dummies/elgoumx
(add-hook 'mu4e-headers-mode-hook
      (defun my/mu4e-change-headers ()
    (interactive)
    (setq mu4e-headers-fields
          `((:human-date . 25) ;; alternatively, use :date
        (:flags . 6)
        (:from . 22)
        (:thread-subject . ,(- (window-body-width) 70)) ;; alternatively, use :subject
        (:size . 7)))))

;; if you use date instead of human-date in the above, use this setting
;; give me ISO(ish) format date-time stamps in the header list
;(setq mu4e-headers-date-format "%Y-%m-%d %H:%M")

;; spell check
(add-hook 'mu4e-compose-mode-hook
    (defun my-do-compose-stuff ()
       "My settings for message composition."
       (visual-line-mode)
       (org-mu4e-compose-org-mode)
           (use-hard-newlines -1)
       (flyspell-mode)))

(require 'smtpmail)

;;rename files when moving
;;NEEDED FOR MBSYNC
(setq mu4e-change-filenames-when-moving t)

;;set up queue for offline email
;;use mu mkdir  ~/Maildir/acc/queue to set up first
(setq smtpmail-queue-mail nil)  ;; start in normal mode

;;from the info manual
(setq mu4e-attachment-dir  "~/Downloads")

(setq message-kill-buffer-on-exit t)
(setq mu4e-compose-dont-reply-to-self t)

(require 'org-mu4e)

;; convert org mode to HTML automatically
(setq org-mu4e-convert-to-html t)

;;from vxlabs config
;; show full addresses in view message (instead of just names)
;; toggle per name with M-RET
(setq mu4e-view-show-addresses 't)

;; don't ask when quitting
(setq mu4e-confirm-quit nil)

;; mu4e-context
(setq mu4e-context-policy 'pick-first)
(setq mu4e-compose-context-policy 'always-ask)
(setq mu4e-contexts
  (list
   (make-mu4e-context
    :name "personal" ;;for personal-gmail
    :enter-func (lambda () (mu4e-message "Entering context personal"))
    :leave-func (lambda () (mu4e-message "Leaving context personal"))
    :match-func (lambda (msg)
          (when msg
        (mu4e-message-contact-field-matches
         msg '(:from :to :cc :bcc) "rwjdyson@gmail.com")))
    :vars '((user-mail-address . "rwjdyson@gmail.com")
        (user-full-name . "Rob Dyson")
        (mu4e-sent-folder . "/personal-gmail/[personal].Sent Mail")
        (mu4e-drafts-folder . "/personal-gmail/[personal].drafts")
        (mu4e-trash-folder . "/personal-gmail/[personal].Trash")
        (mu4e-compose-signature . (concat ""))
        (mu4e-compose-format-flowed . t)
        (smtpmail-queue-dir . "~/Maildir/personal-gmail/queue/cur")
        (message-send-mail-function . smtpmail-send-it)
        ;;(smtpmail-default-smtp-server . "smtp.gmail.com")
        ;;(smtpmail-smtp-server . "smtp.gmail.com")
        ;;(smtpmail-smtp-service . 587)
        (smtpmail-debug-info . t)
        (smtpmail-debug-verbose . t)
        (mu4e-maildir-shortcuts . ( ("/personal-gmail/INBOX"            . ?i)
                    ("/personal-gmail/[personal].Sent Mail" . ?s)
                    ("/personal-gmail/[personal].Trash"      . ?t)
                    ("/personal-gmail/[personal].All Mail"  . ?a)
                    ("/personal-gmail/[personal].Starred"   . ?r)
                    ("/personal-gmail/[personal].drafts"    . ?d)
                    ))))
   (make-mu4e-context
    :name "runa" ;;for runa-gmail
    :enter-func (lambda () (mu4e-message "Entering context Runa"))
    :leave-func (lambda () (mu4e-message "Leaving context Runa"))
    :match-func (lambda (msg)
          (when msg
        (mu4e-message-contact-field-matches
         msg '(:from :to :cc :bcc) "rob.dyson@runahr.com")))
    :vars '((user-mail-address . "rob.dyson@runahr.com")
        (user-full-name . "Rob Dyson")
        (mu4e-sent-folder . "/runa-gmail/[runa].Sent Mail")
        (mu4e-drafts-folder . "/runa-gmail/[runa].drafts")
        (mu4e-trash-folder . "/runa-gmail/[runa].Trash")
        (mu4e-compose-signature . (concat ""))
        (mu4e-compose-format-flowed . t)
        (smtpmail-queue-dir . "~/Maildir/runa-gmail/queue/cur")
        (message-send-mail-function . smtpmail-send-it)
        ;;(smtpmail-default-smtp-server . "smtp.gmail.com")
        ;;(smtpmail-smtp-server . "smtp.gmail.com")
        ;;(smtpmail-smtp-service . 587)
        (smtpmail-debug-info . t)
        (smtpmail-debug-verbose . t)
        (mu4e-maildir-shortcuts . ( ("/runa-gmail/INBOX"            . ?i)
                    ("/runa-gmail/[runa].Sent Mail" . ?s)
                    ("/runa-gmail/[runa].Trash"     . ?t)
                    ("/runa-gmail/[runa].All Mail"  . ?a)
                    ("/runa-gmail/[runa].Starred"   . ?r)
                    ("/runa-gmail/[runa].drafts"    . ?d)
                    ))))))
