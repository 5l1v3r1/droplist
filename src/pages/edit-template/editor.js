// @flow
import * as React from "react";
import type { Template } from "../../lib/types/content";
import { Select, SIZE as SelectSIZE } from "baseui/select";
import { Label4 } from "baseui/typography";
import {
  SIZE as SpinnerSIZE,
  StyledSpinnerNext as Spinner,
} from "baseui/spinner";
import { Spacer20, Spacer8 } from "../../style-guide/spacer";
import { Textarea } from "baseui/textarea";
import { useStyletron } from "baseui";
import { SNIPPET_OPTIONS } from "./snippets";
import { debounce } from "lodash";
import { Input, SIZE as InputSIZE } from "baseui/input";

type Props = {
  template: Template,
  saving: boolean,
  saveError: boolean,
  onSave: (template: Template) => void,
};

const TemplateEditor = (props: Props) => {
  const [css] = useStyletron();
  const inputRef = React.useRef(null);
  const [subject, setSubject] = React.useState(props.template.Subject);
  const [previewText, setPreviewText] = React.useState(
    props.template.PreviewText || ""
  );
  const [html, setHTML] = React.useState(props.template.HTMLBody);

  const onTemplateEdit = React.useCallback(
    debounce((template: Template) => {
      props.onSave(template);
    }, 1000),
    [props.template]
  );

  const isDirty = () =>
    !(
      props.template.Subject === subject &&
      props.template.PreviewText === (previewText || null) &&
      props.template.HTMLBody === html
    );

  return (
    <div className={css({ display: "flex", flexDirection: "column", flex: 1 })}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Select
          size={SelectSIZE.mini}
          placeholder={"Insert Snippet"}
          searchable={false}
          options={SNIPPET_OPTIONS}
          overrides={{
            Root: { style: { height: "28px", width: "200px" } },
          }}
          onChange={({ value }) => {
            if (!value.length) {
              return;
            }

            const { snippet } = value[0];

            const caretPos = inputRef.current.selectionStart;
            const updatedHTML =
              html.substring(0, caretPos) + snippet + html.substring(caretPos);

            setHTML(updatedHTML);
            onTemplateEdit({ ...props.template, HTMLBody: updatedHTML });

            inputRef.current.focus();
          }}
        />

        <Label4>
          {props.saving ? (
            <Spinner $size={SpinnerSIZE.small} />
          ) : props.saveError ? (
            "Failed to save changes"
          ) : isDirty() ? (
            "Unsaved changes"
          ) : (
            "All changes saved"
          )}
        </Label4>
      </div>
      <Spacer20 />
      <Input
        size={InputSIZE.compact}
        placeholder="Subject"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          onTemplateEdit({
            ...props.template,
            Subject: e.target.value,
          });
        }}
      />
      <Spacer8 />
      <Input
        size={InputSIZE.compact}
        placeholder="Preview Text"
        value={previewText}
        onChange={(e) => {
          setPreviewText(e.target.value);
          onTemplateEdit({
            ...props.template,
            PreviewText: e.target.value || null,
          });
        }}
      />
      <Spacer8 />
      <Textarea
        inputRef={inputRef}
        value={html}
        onChange={(e) => {
          setHTML(e.target.value);
          onTemplateEdit({ ...props.template, HTMLBody: e.target.value });
        }}
        placeholder="Write your email HTML here"
        overrides={{
          InputContainer: { style: { flex: 1 } },
          Input: { style: { fontFamily: "monospace", fontSize: "14px" } },
        }}
      />
    </div>
  );
};

export default TemplateEditor;
