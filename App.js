import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';

export default function App() {
  const [message, setMessage] = useState("");
  const [usermessage, setUsermessage] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (message.length > 0 && index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + message[index]);
        setIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [index, message]);

  const url = "https://apifreellm.com/api/chat";

  async function askAI() {
    try {
      // Reset before fetching
      setDisplayText("");
      setIndex(0);
      setMessage(""); // reset to prevent leftover content

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: usermessage,
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.status === "success" && data.response) {
        setMessage(data.response); // ✅ triggers typing effect
      } else {
        console.error("Error:", data.error);
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error fetching response from AI.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask something..."
        value={usermessage}
        onChangeText={setUsermessage}
      />
      <Button title="Send" onPress={askAI} />
      <Text style={styles.response}>{displayText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, marginTop: 50 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  response: { marginTop: 20, fontSize: 16 },
});
