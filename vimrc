syntax on
set tabstop=2 shiftwidth=2 expandtab
set number                      " Display line numbers beside buffer
set nocompatible                " Don't maintain compatibilty with Vi.
set hidden                      " Allow buffer change w/o saving
set lazyredraw                  " Don't update while executing macros
set backspace=indent,eol,start  " Sane backspace behavior
set history=1000                " Remember last 1000 commands
set scrolloff=4                 " Keep at least 4 lines below cursor

" Use the space key as our leader. Put this near the top of your vimrc
let mapleader = "\<Space>"

" Split edit your vimrc. Type space, v, r in sequence to trigger
nmap <leader>vr :sp $MYVIMRC<cr>

" Source (reload) your vimrc. Type space, s, o in sequence to trigger
nmap <leader>so :source $MYVIMRC<cr>

" Bind `q` to close the buffer for help files
autocmd Filetype help nnoremap <buffer> q :q<CR>

" Move up and down by visible lines if current line is wrapped
nmap j gj
nmap k gk

" automatically rebalance windows on vim resize
autocmd VimResized * :wincmd =

" zoom a vim pane, <C-w>= to re-balance
nnoremap <leader>- :wincmd _<cr>:wincmd \|<cr>
nnoremap <leader>= :wincmd =<cr>

" Vim-plug
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
  \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall | source $MYVIMRC
endif

call plug#begin('~/.vim/plugged')

Plug 'christoomey/vim-tmux-navigator'
Plug 'ctrlpvim/ctrlp.vim'

call plug#end()
