import { useHolidayTheme } from '@/context/HolidayThemeContext';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const GradientBackground = () => {
    const { holiday, themeColors } = useHolidayTheme();

    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(2 * Math.PI, { duration: 10000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    // Soft, premium gradients based on theme
    const colors = holiday === 'christmas'
        ? [themeColors.background, '#F8E8D4', '#E8D4BC']
        : [themeColors.background, '#FFF0E0', '#FFD70033']; // Adding a hint of gold for New Year

    // Use derived values to animate colors or positions
    const startVec = useDerivedValue(() => {
        return vec(0, 0);
    });
    const endVec = useDerivedValue(() => {
        return vec(width, height);
    });

    return (
        <View style={StyleSheet.absoluteFill}>
            <Canvas style={{ flex: 1 }}>
                <Rect x={0} y={0} width={width} height={height}>
                    <LinearGradient
                        start={startVec}
                        end={endVec}
                        colors={colors}
                    />
                </Rect>
                {/* Subtle overlay for texture/premium feel */}
                <Rect x={0} y={0} width={width} height={height} color="#ffffff11" />
            </Canvas>
        </View>
    );
};
