// https://api.dicebear.com/7.x/pixel-art/svg?seed=
// This file generates a random avatar URL using the DiceBear API
export const randomAvatar = (): string => {
  return `https://api.dicebear.com/7.x/pixel-art/png?seed=${Math.floor(Math.random() * 10000)}`;
};
