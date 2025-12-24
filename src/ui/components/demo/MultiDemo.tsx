import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import { InkMultilineInput } from '../index.js'; // 引入上面的组件

export const MultiDemo = () => {
  const [submittedText, setSubmittedText] = useState<string | null>(null);

  if (submittedText) {
    return (
      <Box flexDirection="column">
        <Text color="green">✔ Prompt Submitted:</Text>
        <Box borderStyle="single" padding={1}>
          <Text>{submittedText}</Text>
        </Box>
      </Box>
    );
  }

  return <InkMultilineInput onSubmit={(val) => setSubmittedText(val)} />;
};
