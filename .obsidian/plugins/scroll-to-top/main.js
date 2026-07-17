const { Plugin } = require("obsidian");

module.exports = class ScrollToTopPlugin extends Plugin {
    onload() {
        this.addCommand({
            id: "scroll-to-top",
            name: "Перейти в начало заметки",
            editorCallback: (editor) => {
                editor.setCursor({ line: 0, ch: 0 });
                editor.scrollIntoView(
                    { from: { line: 0, ch: 0 }, to: { line: 0, ch: 0 } },
                    true
                );
            },
        });
    }
};
