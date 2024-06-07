-- Taken from typecraft.dev
-- lazy nvim plugin manager
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
	vim.fn.system({
		"git",
		"clone",
		"--filter=blob:none",
		"https://github.com/folke/lazy.nvim.git",
		"--branch=stable",
		lazypath,
	})
end
vim.opt.rtp:prepend(lazypath)

-- Set bgcolor https://stackoverflow.com/a/73370407
vim.api.nvim_set_hl(0, "Normal", { guibg = Black })

require("vim-options")
require("lazy").setup({ { import = "plugins" }, { import = "plugins.lsp" } }, {
	checker = {
		enabled = true,
		notify = false,
	},
	change_detection = {
		notify = false,
	},
})
