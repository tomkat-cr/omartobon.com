import os
import re
from html.parser import HTMLParser


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.output = []
        self.current_line = ""
        self.in_script_or_style = False
        self.title = None
        self.tag_stack = []
        self.link_url = None
        self.special_chars = ("›", "🖥️", "🎲", "✉️", "⚙️", "👉", "✅")
        self.block_tags = {
            'p', 'div', 'section', 'main', 'li', 'br', 'header', 'footer', 'article', 'aside',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'hr', 'button'
        }
        self.inline_tags = {
            'strong': '**',
            'b': '**',
            'em': '*',
            'i': '*',
            'code': '`',
            's': '~~',
            'strike': '~~',
            'del': '~~'
        }

    def flush_line(self):
        line = self.current_line.strip()
        if line:
            if not line.startswith("*") and not line.startswith("#"):
                for sc in self.special_chars:
                    if line.startswith(sc):
                        line = f"* {sc} {line[len(sc):].strip()}"
                        break
            self.output.append(line)
        self.current_line = ""

    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        if tag in ['script', 'style']:
            self.in_script_or_style = True
        elif tag in self.block_tags:
            self.flush_line()
            if tag == 'li':
                self.current_line = "* "
            elif tag == 'hr':
                self.output.append("---")
        elif tag in self.inline_tags:
            self.current_line += self.inline_tags[tag]
        elif tag == 'a':
            self.current_line += "["
            attr_dict = dict(attrs)
            self.link_url = attr_dict.get('href')

    def handle_endtag(self, tag):
        if self.tag_stack:
            self.tag_stack.pop()
        if tag in ['script', 'style']:
            self.in_script_or_style = False
        elif tag in self.block_tags:
            self.flush_line()
        elif tag in self.inline_tags:
            self.current_line = self.current_line.rstrip() + \
                self.inline_tags[tag]
        elif tag == 'a':
            url = self.link_url if self.link_url else ""
            self.current_line = self.current_line.rstrip() + f"]({url})"
            self.link_url = None

    def handle_data(self, data):
        if self.in_script_or_style:
            return
        if 'title' in self.tag_stack and not self.title:
            self.title = data.strip()
            return
        stripped_data = data.strip()
        if not stripped_data:
            return

        header_match = re.match(
            r'h([1-6])', (self.tag_stack[-1] if self.tag_stack else '') or '')
        if header_match and not self.current_line.strip():
            level = int(header_match.group(1))
            self.current_line = f"{'#' * (level + 1)} "
            if not self.title:
                self.title = stripped_data

        found_sc = next(
            (sc for sc in self.special_chars if stripped_data.startswith(sc)), None)
        if found_sc:
            text = stripped_data[len(found_sc):].strip()
            if not self.current_line.strip() and self.output:
                prev_line = self.output.pop()
                prev_line = prev_line.rstrip() + f" {found_sc} {text}"
                self.output.append(prev_line)
                return
            if not self.current_line.strip() or self.current_line.strip() == "*":
                self.current_line = f"* {found_sc} {text}"
            else:
                self.current_line = self.current_line.rstrip() + \
                    f" {found_sc} {text}"
            return

        if self.current_line:
            is_opening = False
            for m in ['**', '*', '[', '(', '`']:
                if self.current_line.endswith(m):
                    before_m = self.current_line[:-len(m)]
                    if not before_m or before_m.endswith(" "):
                        is_opening = True
                        break

            if not is_opening and not stripped_data.startswith(('.', ',', '!', '?', ')', ']', ':', ';')):
                if not self.current_line.endswith(" "):
                    self.current_line += " "

        self.current_line += stripped_data


def clean_html_text(html_content, filename):
    parser = TextExtractor()
    parser.feed(html_content)
    parser.flush_line()
    title = parser.title or filename
    processed_output = []
    skipped_title = False
    for item in parser.output:
        clean_item = item.lstrip('# ').strip()
        if not skipped_title and clean_item.lower() == title.lower():
            skipped_title = True
            continue
        processed_output.append(item)
    body_text = "\n\n".join(processed_output)
    body_text = re.sub(r'(\n#{3,} .*)', r'\n\1', body_text)
    body_text = re.sub(r'\n{3,}', '\n\n', body_text)
    return title, body_text


def main():
    www_dir = "www"
    output_file = "GEMINI_ALL_WS_TEXTS.md"
    base_url = "https://omartobon.com/"

    if not os.path.exists(www_dir):
        return
    html_files = sorted(
        [f for f in os.listdir(www_dir) if f.endswith(".html")])
    if "index.html" in html_files:
        html_files.remove("index.html")
        html_files = ["index.html"] + html_files
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("# OTO VISUAL FLOW - Extracted Content\n\n")
        for filename in html_files:
            with open(os.path.join(www_dir, filename), "r", encoding="utf-8") as f:
                content = f.read()
            title, body_text = clean_html_text(content, filename)

            url = base_url
            if filename != "index.html":
                page_name = filename.replace(".html", "")
                url += f"#{page_name}"

            out.write(f"## {title}\n\n")
            out.write(f"File: `www/{filename}`\n")
            out.write(f"URL: {url}\n\n")
            out.write(f"{body_text}\n\n")
            out.write("---\n\n")
    print(f"Generated {output_file}")


if __name__ == "__main__":
    main()
