local opt = vim.opt

-- map leader to space
vim.g.mapleader = " "

-- line numbers
opt.relativenumber = true
opt.number = true

-- tabs & indentation
opt.expandtab = true -- expand tab to spaces
opt.tabstop = 2 -- 2 spaces for tabs
opt.softtabstop = 2 -- 2 spaces when pressing tab
opt.shiftwidth = 2 -- 2 spaces for indent width
opt.autoindent = true -- copy indent from current line when starting new line

-- search settings
opt.ignorecase = true -- ignore case by default
opt.smartcase = true -- case-sensitive if you include case

-- highlight current line
opt.cursorline = true

-- use system clipboard
opt.clipboard:append("unnamedplus")

-- key mappings
local keymap = vim.keymap

--- navigate panes using vim keys
keymap.set("n", "<c-k>", ":wincmd k<CR>")
keymap.set("n", "<c-j>", ":wincmd j<CR>")
keymap.set("n", "<c-h>", ":wincmd h<CR>")
keymap.set("n", "<c-l>", ":wincmd l<CR>")

--- clear search
keymap.set("n", "<leader>h", ":nohlsearch<CR>", { desc = "Clear search" })

--- splits
keymap.set("n", "<leader>s|", "<C-w>v", { desc = "Split vertically" })
keymap.set("n", "<leader>s-", "<C-w>s", { desc = "Split horizontally" })
keymap.set("n", "<leader>se", "<C-w>=", { desc = "Make splits equal size" })
keymap.set("n", "<leader>sx", "<cmd>close<CR>", { desc = "Close current split" })

--- tabs
keymap.set("n", "<leader>to", "<cmd>tabnew<CR>", { desc = "New tab" })
keymap.set("n", "<leader>tx", "<cmd>tabclose<CR>", { desc = "Close tab" })
keymap.set("n", "<leader>tn", "<cmd>tabn<CR>", { desc = "Next tab" })
keymap.set("n", "<leader>tp", "<cmd>tabp<CR>", { desc = "Previous tab" })
keymap.set("n", "<leader>tf", "<cmd>tabnew %<CR>", { desc = "Open file in new tab" })

--- source
keymap.set("n", "<leader>so", "<cmd>source %<CR>")
