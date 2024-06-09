# nvim

Based heavily on [josean's setup](https://bit.ly/4agkTyQ) and [typecraft's playlist](https://www.youtube.com/playlist?list=PLsz00TDipIffreIaUNk64KxTIkQaGguqn)

## key mappings

leader: space
source: leader + s + o
navigate panes: ctrl + kjhl
clear search: leader + h

### splits

leader + s + ...

- open: | or -
- make equal: e
- close: leader x

### tabs

leader + t + ...

- new: o
- close: x
- next: n
- previous: p
- current file in new tab: f

### comments

from Comment.nvim

- selected in visual mode: gc or gb
- line: gcc or gbc

### files

- tree (neo-tree): <C-n>
- find (telescope): <C-p>
- grep (telescope): leader + fg

### misc

- trigger lint: leader + l
- trouble diagnostics: leader + xx

## plugins

- autocomplete: [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) uses various sources including nvim_lsp
- auto pairs: [nvim-autopairs](https://github.com/windwp/nvim-autopairs)
- bufferline (top bar): [bufferline](https://github.com/akinsho/bufferline.nvim)
- comments: [comment](https://github.com/numToStr/Comment.nvim)
- [copilot](https://github.com/github/copilot.vim)
- file open and grep: [telescope](https://github.com/nvim-telescope/telescope.nvim)
- file tree: [neo-tree](https://github.com/nvim-neo-tree/neo-tree.nvim)
- formatting: [conform](https://github.com/stevearc/conform.nvim) format on save
- git: [gitsigns](https://github.com/lewis6991/gitsigns.nvim) for git status in the gutter and [lazygit](https://github.com/kdheepak/lazygit.nvim) for interactive git
- linting: [nvim-lint](https://github.com/mfussenegger/nvim-lint) on write and leaving insert
- lualine (bottom bar): [lualine](https://github.com/nvim-lualine/lualine.nvim)
- marked (markdown preview): [marked.nvim](https://github.com/itspriddle/vim-marked)
- syntax highlighting: [treesitter](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#quickstart)

### lsp

- [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) configurations for various language servers
- [trouble](https://github.com/folke/trouble.nvim) shows all lsp diagnostics in a popup
- [mason](https://github.com/williamboman/mason.nvim) for managing lsp servers and formatters

### utilities

- [nvim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator) navigate between nvim and tmux panes
- [which-key](https://github.com/folke/which-key.nvim) displays key mappings after slight delay

# tmux

Based heavily on [josean's setup](https://bit.ly/4agkTyQ) and [typecraft's playlist](https://www.youtube.com/playlist?list=PLsz00TDipIffreIaUNk64KxTIkQaGguqn)

## key mappings

- leader: C-s
- source: leader + r
- select and yank with v and y
- splits: leader + | or -
- navigate panes: C + hjkl
- resize panes: leader + hjkl

## plugins

- [tpm](https://github.com/tmux-plugins/tpm) plugin manager
- [catppuccin theme](https://github.com/catppuccin/tmux)
- [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator) navigate between nvim and tmux panes
