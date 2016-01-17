# Path to your oh-my-zsh configuration.
export ZSH=$HOME/.oh-my-zsh

# Set to the name theme to load.
# Look in ~/.oh-my-zsh/themes/
# export ZSH_THEME="rdyson"
export ZSH_THEME="honukai"

# Set Rails enviornment to default to dev
export RAILS_ENV=development

# Set to this to use case-sensitive completion
# export CASE_SENSITIVE="true"

# Comment this out to disable weekly auto-update checks
# export DISABLE_AUTO_UPDATE="true"

# Uncomment following line if you want to disable colors in ls
# export DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
export DISABLE_AUTO_TITLE="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git osx)

source $ZSH/oh-my-zsh.sh

############################
# Customize to your needs...
############################

# aliases
alias lh="ls -lhG"
alias rmm="ssh masterho@rodneymills.com -p 2222"
alias dh="ssh rdyson@dawson.dreamhost.com"
alias gpom="git push origin master"
alias tmux="TERM=screen-256color-bce tmux"
alias git="hub"

# display CPU time if process takes longer than 5s to execute
REPORTTIME=5
TIMEFMT="%U user %S system %P cpu %*Es total"

# show current dir in title bar
precmd() {
  [[ -t 1 ]] || return
  case $TERM in
    (sun-cmd) print -Pn "\e]l%~\e\\"
      ;;
    (*xterm*|rxvt|(dt|k|E)term) print -Pn "\e]2;%~\a"
      ;;
  esac
}

# Autojump
#if [ -f `brew --prefix`/etc/autojump ]; then
#  . `brew --prefix`/etc/autojump
#fi

# rbenv
export PATH=/Users/rdyson/.rbenv/bin:${PATH}
#export PATH=~/.rbenv/bin:$PATH
eval "$(rbenv init -)"

export PATH
export PATH="$PATH:$HOME/bin"
export PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"

export NVM_DIR="/Users/rdyson/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

function vudo() {
  eval "vagrant ssh -c \"cd /vagrant && $@\"" 
}

function vspec() {
  eval "xvfb-run -a bundle exec rspec $@"
}

# added by travis gem
[ -f /Users/rdyson/.travis/travis.sh ] && source /Users/rdyson/.travis/travis.sh
