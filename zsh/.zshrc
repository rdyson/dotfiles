# p10k
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
ZSH_THEME="powerlevel10k/powerlevel10k"

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# OMZ
export ZSH="$HOME/.oh-my-zsh"
plugins=(aws git z sudo docker kubectl zsh-autosuggestions)
source $ZSH/oh-my-zsh.sh

# Aliases
alias cat='bat'
alias find='fd'
alias drama='shortcuts run "Drama"'

# Syntax highlighting
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# asdf
. /opt/homebrew/opt/asdf/libexec/asdf.sh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Python
export PATH="/Users/rdyson/Library/Python/3.9/bin:$PATH"
