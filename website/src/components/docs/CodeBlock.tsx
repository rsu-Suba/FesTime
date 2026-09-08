"use client";

import React, { useState, useMemo } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "bash",
  filename,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanCode = code.trim();

  const highlightedHtml = useMemo(() => {
    const langKey = language.toLowerCase();
    const grammar = Prism.languages[langKey] || Prism.languages.bash || Prism.languages.javascript;
    try {
      return Prism.highlight(cleanCode, grammar, langKey);
    } catch {
      return cleanCode;
    }
  }, [cleanCode, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`clean-code-wrapper ${className}`}>
      {filename && (
        <div className="clean-code-filename-bar">
          <span>{filename}</span>
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="clean-code-copy-btn"
        title="コードをコピー"
        aria-label="コードをコピー"
      >
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <pre
        className={`clean-code-pre language-${language}`}
        tabIndex={0}
        suppressHydrationWarning
      >
        <code
          className={`language-${language}`}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
