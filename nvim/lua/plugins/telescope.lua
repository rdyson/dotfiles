return {
	"nvim-telescope/telescope.nvim",
	tag = "0.1.6",
	dependencies = {
		"nvim-lua/plenary.nvim",
	},
	config = function()
		local builtin = require("telescope.builtin")
		local find_files = function()
			builtin.find_files({ hidden = true })
		end

		vim.keymap.set("n", "<C-p>", find_files, {})
		vim.keymap.set("n", "<leader>fg", builtin.live_grep, {})
	end,
}
