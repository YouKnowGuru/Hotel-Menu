import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useFeatureSupport } from "@canva/app-hooks";
import * as styles from "./styles.css";

/**
 * Menu Studio — Canva app.
 *
 * Ports menu-studio's canvas "add text / add menu item" actions to the Canva
 * editor via the @canva/design API. Each button calls addElement to drop a
 * text element onto the user's Canva design at the current cursor/point.
 */
export function App() {
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn)
  );

  const addText = (children: string[]) => {
    addElement?.({ type: "text", children });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>Menu Studio</Title>
        <Text>Drop menu elements straight into your Canva design.</Text>
        <Button
          variant="primary"
          onClick={() => addText(["MENUS"])}
          disabled={!addElement}
          stretch
        >
          Add menu heading
        </Button>
        <Button
          variant="secondary"
          onClick={() => addText(["— Starters —"])}
          disabled={!addElement}
          stretch
        >
          Add section title
        </Button>
        <Button
          variant="secondary"
          onClick={() => addText(["Bruschetta · $9"])}
          disabled={!addElement}
          stretch
        >
          Add menu item
        </Button>
      </Rows>
    </div>
  );
}
