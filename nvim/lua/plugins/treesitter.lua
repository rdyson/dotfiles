return { 
  "nvim-treesitter/nvim-treesitter",
  build = ":TSUpdate",
  dependencies = {
    "windwp/nvim-ts-autotag",
  },
  config = function()
    local config = require("nvim-treesitter.configs")
    require('nvim-ts-autotag').setup({
      enable = true,
      filetypes = { "html" },
    })
    config.setup({
      highlight = { enable = true },
      indent = { enable = true },
      ensure_installed = {
        "bash",
        "c", 
        "css",
        "dockerfile",
        "html",
        "javascript", 
        "json",
        "lua", 
        "markdown",
        "markdown_inline",
        "tsx",
        "typescript",
        "vim", 
        "yaml",
      },
    })
  end,
}

