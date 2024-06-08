return {
	{
		"timpope/vim-fugitive",
	},
	{
		"lewis6991/gitsigns.nvim",
		config = function()
			require("gitsigns").setup()
		end,
		vim.keymap.set("n", "<leader>gv", ":Gitsigns preview_hunk_inline<CR>", {}),
	},
}
