import antfu from "@antfu/eslint-config";

export default antfu({
    ignores: ["bun.lock", ".agents", "src/components/ui", "*.md"],
    stylistic: {
        semi: true,
        indent: 4,
        quotes: "double",
    },
    react: true,
    typescript: {
        overrides: {
            "no-console": "off", // not sure if I should keep it for further development iterations
        },
    },
    rules: {
        "node/prefer-global/process": "off",
    },
});
