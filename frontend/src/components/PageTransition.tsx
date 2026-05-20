import { type ReactNode, useEffect, useRef, useState } from "react";
import { Box, Fade } from "@mui/material";

interface PageTransitionProps {
  transitionKey: string;
  children: ReactNode;
}

const transitionDuration = 220;

const PageTransition = ({ transitionKey, children }: PageTransitionProps) => {
  const [visible, setVisible] = useState(true);
  const [renderedKey, setRenderedKey] = useState(transitionKey);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const pendingChildrenRef = useRef(children);
  const pendingKeyRef = useRef(transitionKey);

  useEffect(() => {
    pendingChildrenRef.current = children;
    pendingKeyRef.current = transitionKey;

    if (transitionKey !== renderedKey) {
      setVisible(false);
    }
  }, [children, renderedKey, transitionKey]);

  const handleExited = () => {
    setRenderedKey(pendingKeyRef.current);
    setRenderedChildren(pendingChildrenRef.current);
    setVisible(true);
  };

  return (
    <Fade in={visible} timeout={transitionDuration} onExited={handleExited}>
      <Box
        sx={{
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: transitionDuration,
              easing: theme.transitions.easing.easeOut,
            }),
        }}
      >
        {renderedChildren}
      </Box>
    </Fade>
  );
};

export default PageTransition;
