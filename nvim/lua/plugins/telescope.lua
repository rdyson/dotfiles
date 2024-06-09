return {
	"nvim-telescope/telescope.nvim",
	tag = "0.1.6",
	dependencies = {
		"nvim-lua/plenary.nvim",
		"nvim-tree/nvim-web-devicons",
		{ "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
	},
	config = function()
		local builtin = require("telescope.builtin")
		local find_files = function()
			builtin.find_files({ hidden = true })
		end

		local telescope = require("telescope")
		telescope.setup({
			defaults = {
				path_display = { "smart" },
			},
		})

		vim.keymap.set("n", "<C-o>", find_files, {})
		vim.keymap.set("n", "<leader>fg", builtin.live_grep, {})

		telescope.load_extension("fzf")
	end,
}
