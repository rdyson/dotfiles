set tabstop=1 shiftwidth=1 expandtab
set number                      " Display line numbers beside buffer
set relativenumber              " Show relative line number
set nocompatible                " Don't maintain compatibility with Vi.
set hidden                      " Allow buffer change w/o saving
set lazyredraw                  " Don't update while executing macros
set backspace=indent,eol,start  " Sane backspace behavior
set history=200                 " Remember last 200 commands
set scrolloff=4                 " Keep at least 4 lines below cursor
set incsearch                   " Incremental search
set hlsearch                    " Highlight search results
set ignorecase                  " Ignore case when searching
set splitbelow                  " When splitting vertically, split below
set splitright                  " When splitting horizontally, split right
set linebreak                   " Break long lines by word
setlocal spell                  " Enable spell check

" Use the space key as our leader. Put this near the top of your vimrc
let mapleader = "\<Space>"

" Quick save
nmap <leader>s <C-o>:w<cr>

" Escape save
inoremap <esc> <esc>:w<CR>
autocmd InsertLeave * nnoremap <esc> <esc>:w<CR>

" Split edit your vimrc. Type space, v, r in sequence to trigger
nmap <leader>vr :sp $MYVIMRC<cr>

" Source (reload) your vimrc. Type space, s, o in sequence to trigger
nmap <leader>so :source $MYVIMRC<cr>

" Copy the entire buffer into the system register
nmap <leader>co ggVG*y

" Indent whole file
nmap <leader>i mmgg=G`m<CR>

" Turn highlight search results off
" nmap <leader>h :nohlsearch<CR>
" nmap <esc> :nohlsearch<CR>

" 0 goes to beginning of characters on a line instead of far left
nmap 0 ^

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

" bind K to grep word under cursor
nnoremap K :grep! "\b<C-R><C-W>\b"<CR>:cw<CR>

" swap between current and last buffer
nmap <leader>; :e#<CR>

" fzf keybindings
nmap ; :Buffers<CR>
nmap <C-t> :Files<CR>
" nmap <C-r> :Tags<CR>

" Vim-plug
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
        \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall | source $MYVIMRC
endif

" bind \ (backward slash) to grep shortcut
nnoremap \ :Ack<SPACE>

if executable('ag')
  let g:ackprg = 'ag --vimgrep'
endif

call plug#begin('~/.vim/plugged')

Plug 'junegunn/seoul256.vim'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-unimpaired'
Plug 'mileszs/ack.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'airblade/vim-gitgutter'
Plug 'itspriddle/vim-marked'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'junegunn/goyo.vim'
Plug 'plasticboy/vim-markdown'
Plug 'ctrlpvim/ctrlp.vim'

" Plug 'sheerun/vim-polyglot'
" Plug 'godlygeek/tabular'
" Plug 'christoomey/vim-tmux-navigator'
" Plug 'henrik/vim-qargs'
" Plug 'dyng/ctrlsf.vim'
" Plug 'terryma/vim-multiple-cursors'
" Plug 'tpope/vim-rails'
" Plug 'tpope/vim-rake'
" Plug 'tpope/vim-repeat'
" Plug 'tpope/vim-commentary'
" Plug 'tpope/vim-fugitive'
" Plug 'tpope/vim-bundler'

set updatetime=250

call plug#end()

" Color scheme
let g:seoul256_background = 235
color seoul256

" Set line highlight on
set cursorline
highlight CursorLine ctermbg=Black

" Yank to clipboard
set clipboard=unnamed

" Disable Markdown folding
let g:vim_markdown_folding_disabled = 1

