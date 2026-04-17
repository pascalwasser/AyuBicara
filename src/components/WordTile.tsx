import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type TileStyle = 'bank' | 'selected' | 'correct' | 'incorrect';

type Colors = {
  tileBankBg: string;
  tileBankBorder: string;
  tileSelectedBg: string;
  tileSelectedBorder: string;
  text: string;
};

type Props = {
  word: string;
  tileStyle: TileStyle;
  onPress: () => void;
  colors: Colors;
};

export default function WordTile({ word, tileStyle, onPress, colors }: Props) {
  const bg = tileStyle === 'bank' ? colors.tileBankBg
    : tileStyle === 'selected' ? colors.tileSelectedBg
    : tileStyle === 'correct' ? '#f0fdf4'
    : '#fef2f2';

  const border = tileStyle === 'bank' ? colors.tileBankBorder
    : tileStyle === 'selected' ? colors.tileSelectedBorder
    : tileStyle === 'correct' ? '#22c55e'
    : '#ef4444';

  const textColor = tileStyle === 'correct' ? '#22c55e'
    : tileStyle === 'incorrect' ? '#ef4444'
    : colors.text;

  return (
    <TouchableOpacity style={[styles.tile, { backgroundColor: bg, borderColor: border }]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.text, { color: textColor }]}>{word}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    margin: 4,
  },
  text: { fontSize: 16 },
});
