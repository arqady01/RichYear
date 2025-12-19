import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as Haptics from 'expo-haptics';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import * as THREE from 'three';

// 类型定义
interface Player {
  id: number;
  name: string;
  score: number;
}

interface FireworkData {
  id: number;
  position: [number, number, number];
}

type GameState = 'setup' | 'playing';

// 屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 创建初始玩家
const createPlayers = (count: number): Player[] => {
  const names = ['玩家一', '玩家二', '玩家三', '玩家四', '玩家五'];
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: names[i], score: 0 }));
};

// 玩家颜色
const PLAYER_COLORS = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];

// 计算玩家位置
function getPlayerPositions(count: number, isRound: boolean): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const radius = isRound ? 1.4 : 1.3;
  const tableY = 0.15;

  if (isRound) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      positions.push([Math.cos(angle) * radius, tableY, Math.sin(angle) * radius]);
    }
  } else {
    const offsets: [number, number][] = [[0, -radius], [radius, 0], [0, radius], [-radius, 0]];
    for (let i = 0; i < count; i++) {
      positions.push([offsets[i][0], tableY, offsets[i][1]]);
    }
  }
  return positions;
}

// 烟花组件
function Firework({ position, onComplete }: { position: [number, number, number]; onComplete: () => void }) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<THREE.Vector3[]>([]);
  const startTime = useRef(Date.now());
  const particleCount = 60;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    velocitiesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position[0];
      positions[i * 3 + 1] = position[1];
      positions[i * 3 + 2] = position[2];

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.08 + Math.random() * 0.08;
      velocitiesRef.current.push(new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 0.05,
        Math.sin(phi) * Math.sin(theta) * speed
      ));

      const isGold = Math.random() > 0.4;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = isGold ? 0.84 : 0.2;
      colors[i * 3 + 2] = isGold ? 0 : 0.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [position]);

  useFrame(() => {
    if (!particlesRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 2.5) { onComplete(); return; }

    const posAttr = particlesRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const vel = velocitiesRef.current[i];
      posArray[i * 3] += vel.x;
      posArray[i * 3 + 1] += vel.y - 0.003;
      posArray[i * 3 + 2] += vel.z;
    }

    posAttr.needsUpdate = true;
    (particlesRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - elapsed / 2.5);
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.06} vertexColors transparent opacity={1} sizeAttenuation />
    </points>
  );
}


// 圆桌
function RoundTable() {
  const tableRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (tableRef.current) tableRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
  });

  return (
    <group ref={tableRef}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 64, 2]} />
        <meshStandardMaterial color="#8B4513" metalness={0.15} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.051, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.01, 64]} />
        <meshStandardMaterial color="#A0522D" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[1.78, 0.04, 24, 64]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} emissive="#ffd700" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial color="#daa520" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 0.3, 32]} />
        <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.12, 0.4, 32]} />
        <meshStandardMaterial color="#4A2F15" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.95, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.3, 32]} />
        <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.75, 0.12, 32]} />
        <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.08, 0]}>
        <torusGeometry args={[0.72, 0.02, 16, 32]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}


// 方桌
function SquareTable() {
  const tableRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (tableRef.current) tableRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
  });

  return (
    <group ref={tableRef}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.12, 3, 4, 2, 4]} />
        <meshStandardMaterial color="#8B4513" metalness={0.15} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.061, 0]}>
        <boxGeometry args={[2.8, 0.01, 2.8]} />
        <meshStandardMaterial color="#A0522D" metalness={0.1} roughness={0.7} />
      </mesh>
      {[[-1.45, 0], [1.45, 0], [0, -1.45], [0, 1.45]].map(([x, z], i) => (
        <mesh key={`edge-${i}`} position={[x, 0.07, z]} rotation={[0, i < 2 ? Math.PI / 2 : 0, 0]}>
          <boxGeometry args={[3.1, 0.03, 0.06, 8, 1, 1]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} emissive="#ffd700" emissiveIntensity={0.1} />
        </mesh>
      ))}
      {[[-1.45, -1.45], [1.45, -1.45], [-1.45, 1.45], [1.45, 1.45]].map(([x, z], i) => (
        <mesh key={`corner-${i}`} position={[x, 0.07, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      {[[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].map(([x, z], i) => (
        <group key={`leg-${i}`} position={[x, -0.55, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.9, 0.14, 2, 4, 2]} />
            <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.18]} />
            <meshStandardMaterial color="#4A2F15" metalness={0.1} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.16]} />
            <meshStandardMaterial color="#4A2F15" metalness={0.1} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#b8860b" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#5D3A1A" metalness={0.1} roughness={0.85} />
      </mesh>
    </group>
  );
}


// 玩家小人
function PlayerSeat({ position, color, isAnimating }: { 
  position: [number, number, number]; 
  color: string; 
  isAnimating: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const targetScale = useRef(1);

  React.useEffect(() => {
    if (isAnimating) {
      targetScale.current = 1.4;
      setTimeout(() => { targetScale.current = 1; }, 300);
    }
  }, [isAnimating]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const floatY = Math.sin(state.clock.elapsedTime * 2 + position[0] * 3) * 0.03;
    groupRef.current.position.y = position[1] + floatY;
    scaleRef.current += (targetScale.current - scaleRef.current) * 0.15;
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <ringGeometry args={[0.12, 0.2, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.18, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0.035, 0.37, 0.07]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.035, 0.37, 0.07]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.035, 0.37, 0.085]}>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.035, 0.37, 0.085]}>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}


// 相机控制组件
interface CameraControllerProps {
  theta: SharedValue<number>;
  phi: SharedValue<number>;
  radius: SharedValue<number>;
  targetX: SharedValue<number>;
  targetZ: SharedValue<number>;
  onCameraUpdate?: (matrix: THREE.Matrix4, projMatrix: THREE.Matrix4) => void;
}

function CameraController({ theta, phi, radius, targetX, targetZ, onCameraUpdate }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  
  useFrame(() => {
    const t = theta.value;
    const p = phi.value;
    const r = radius.value;
    const tx = targetX.value;
    const tz = targetZ.value;
    
    const x = tx + r * Math.sin(p) * Math.sin(t);
    const y = r * Math.cos(p);
    const z = tz + r * Math.sin(p) * Math.cos(t);
    
    targetPos.current.set(x, y, z);
    camera.position.lerp(targetPos.current, 0.1);
    camera.lookAt(tx, 0, tz);
    
    // 通知外部相机矩阵更新
    if (onCameraUpdate) {
      onCameraUpdate(camera.matrixWorldInverse.clone(), camera.projectionMatrix.clone());
    }
  });
  
  return null;
}


// 3D 场景
function GameScene({ playerCount, animatingCards, fireworks, onFireworkComplete, cameraProps }: {
  playerCount: number;
  animatingCards: Record<number, boolean>;
  fireworks: FireworkData[];
  onFireworkComplete: (id: number) => void;
  cameraProps: CameraControllerProps;
}) {
  const isRound = playerCount === 3 || playerCount === 5;
  const positions = getPlayerPositions(playerCount, isRound);

  return (
    <>
      <CameraController {...cameraProps} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 6, 0]} intensity={200} color="#fff5e6" castShadow />
      <pointLight position={[4, 4, 4]} intensity={80} color="#ffaa66" />
      <pointLight position={[-4, 4, -4]} intensity={80} color="#ff8844" />
      <pointLight position={[0, -0.5, 0]} intensity={30} color="#ffd700" />
      <directionalLight position={[5, 3, 0]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 3, 0]} intensity={1} color="#ffeecc" />

      {isRound ? <RoundTable /> : <SquareTable />}

      {positions.map((pos, index) => (
        <PlayerSeat 
          key={index} 
          position={pos} 
          color={PLAYER_COLORS[index]} 
          isAnimating={animatingCards[index + 1] || false}
        />
      ))}

      {fireworks.map((fw) => (
        <Firework key={fw.id} position={fw.position} onComplete={() => onFireworkComplete(fw.id)} />
      ))}

      <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#1a0808" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 3.1, 64]} />
        <meshStandardMaterial color="#3d1a1a" metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

function LoadingFallback() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ff3333" />
      <Text style={styles.loadingText}>加载 3D 场景中...</Text>
    </View>
  );
}


// 设置界面
function SetupScreen({ onStart }: { onStart: (count: number) => void }) {
  return (
    <View style={styles.setupContainer}>
      <Text style={styles.setupTitle}>🎮 聚会记分板</Text>
      <Text style={styles.setupSubtitle}>选择参与人数</Text>
      <View style={styles.playerCountOptions}>
        {[3, 4, 5].map((count) => (
          <Pressable
            key={count}
            style={({ pressed }) => [styles.countButton, { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onStart(count);
            }}
          >
            <Text style={styles.countNumber}>{count}</Text>
            <Text style={styles.countLabel}>{count === 4 ? '方桌' : '圆桌'}</Text>
            <Text style={styles.countIcon}>{count === 3 ? '👥' : count === 4 ? '🎴' : '👨‍👩‍👧‍👦'}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.setupHint}>3人或5人使用圆桌，4人使用方桌</Text>
    </View>
  );
}

// 3D坐标转屏幕坐标
function project3DToScreen(
  pos3D: [number, number, number],
  viewMatrix: THREE.Matrix4,
  projMatrix: THREE.Matrix4,
  screenWidth: number,
  screenHeight: number
): { x: number; y: number; visible: boolean } {
  const vec = new THREE.Vector3(pos3D[0], pos3D[1], pos3D[2]);
  vec.applyMatrix4(viewMatrix);
  vec.applyMatrix4(projMatrix);
  
  // 检查是否在相机前方
  const visible = vec.z >= -1 && vec.z <= 1;
  
  // NDC 转屏幕坐标
  const x = (vec.x * 0.5 + 0.5) * screenWidth;
  const y = (-vec.y * 0.5 + 0.5) * screenHeight;
  
  return { x, y, visible };
}


// 玩家分数卡片 - 跟随3D位置
function PlayerScoreCard({ player, color, screenPos, onScoreChange }: {
  player: Player;
  color: string;
  screenPos: { x: number; y: number; visible: boolean };
  onScoreChange: (id: number, delta: number) => void;
}) {
  const handlePress = (delta: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onScoreChange(player.id, delta);
  };

  if (!screenPos.visible) return null;

  return (
    <View style={[styles.scoreCard, { left: screenPos.x - 50, top: screenPos.y - 70 }]}>
      <View style={[styles.scoreCardHeader, { backgroundColor: color }]}>
        <Text style={styles.scoreCardName}>{player.name}</Text>
      </View>
      <Text style={[styles.scoreCardScore, { color }]}>{player.score}</Text>
      <View style={styles.scoreCardButtons}>
        <Pressable 
          style={({ pressed }) => [styles.scoreBtn, styles.minusBtn, { opacity: pressed ? 0.6 : 1 }]} 
          onPress={() => handlePress(-1)}
        >
          <Text style={styles.scoreBtnText}>−</Text>
        </Pressable>
        <Pressable 
          style={({ pressed }) => [styles.scoreBtn, styles.plusBtn, { opacity: pressed ? 0.6 : 1 }]} 
          onPress={() => handlePress(1)}
        >
          <Text style={styles.scoreBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}


// 默认相机状态值
const DEFAULT_THETA = 0;
const DEFAULT_PHI = Math.PI / 3.5;
const DEFAULT_RADIUS = 7;
const DEFAULT_TARGET_X = 0;
const DEFAULT_TARGET_Z = 0;

// 相机参数限制
const MIN_PHI = Math.PI / 8;
const MAX_PHI = Math.PI / 2.2;
const MIN_RADIUS = 3.5;
const MAX_RADIUS = 12;
const MAX_PAN = 2;

// 主组件
export default function ScoreboardScreen() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);
  const [animatingCards, setAnimatingCards] = useState<Record<number, boolean>>({});
  const [screenPositions, setScreenPositions] = useState<{ x: number; y: number; visible: boolean }[]>([]);
  const fireworkIdRef = useRef(0);
  
  // 相机矩阵
  const cameraMatricesRef = useRef<{ view: THREE.Matrix4; proj: THREE.Matrix4 } | null>(null);
  
  // 相机控制状态
  const cameraTheta = useSharedValue(DEFAULT_THETA);
  const cameraPhi = useSharedValue(DEFAULT_PHI);
  const cameraRadius = useSharedValue(DEFAULT_RADIUS);
  const cameraTargetX = useSharedValue(DEFAULT_TARGET_X);
  const cameraTargetZ = useSharedValue(DEFAULT_TARGET_Z);
  
  // 手势跟踪值
  const baseTheta = useSharedValue(DEFAULT_THETA);
  const basePhi = useSharedValue(DEFAULT_PHI);
  const baseRadius = useSharedValue(DEFAULT_RADIUS);
  const baseTargetX = useSharedValue(DEFAULT_TARGET_X);
  const baseTargetZ = useSharedValue(DEFAULT_TARGET_Z);

  // 重置相机
  const resetCamera = useCallback(() => {
    cameraTheta.value = withSpring(DEFAULT_THETA);
    cameraPhi.value = withSpring(DEFAULT_PHI);
    cameraRadius.value = withSpring(DEFAULT_RADIUS);
    cameraTargetX.value = withSpring(DEFAULT_TARGET_X);
    cameraTargetZ.value = withSpring(DEFAULT_TARGET_Z);
  }, [cameraTheta, cameraPhi, cameraRadius, cameraTargetX, cameraTargetZ]);


  // 更新屏幕位置
  const updateScreenPositions = useCallback((viewMatrix: THREE.Matrix4, projMatrix: THREE.Matrix4) => {
    cameraMatricesRef.current = { view: viewMatrix, proj: projMatrix };
    
    const isRound = playerCount === 3 || playerCount === 5;
    const positions3D = getPlayerPositions(playerCount, isRound);
    
    const newScreenPositions = positions3D.map(pos => {
      // 头顶位置 (Y + 0.7)
      const headPos: [number, number, number] = [pos[0], pos[1] + 0.7, pos[2]];
      return project3DToScreen(headPos, viewMatrix, projMatrix, SCREEN_WIDTH, SCREEN_HEIGHT);
    });
    
    setScreenPositions(newScreenPositions);
  }, [playerCount]);

  const handleStart = (count: number) => {
    setPlayerCount(count);
    setPlayers(createPlayers(count));
    setGameState('playing');
    resetCamera();
  };

  const handleScoreChange = (playerId: number, delta: number) => {
    setAnimatingCards((prev) => ({ ...prev, [playerId]: true }));
    setTimeout(() => setAnimatingCards((prev) => ({ ...prev, [playerId]: false })), 400);

    setPlayers((prev) => prev.map((p) => {
      if (p.id === playerId) {
        const newScore = p.score + delta;
        if (newScore === 88 || (newScore > 0 && newScore % 88 === 0)) triggerFirework(playerId);
        return { ...p, score: newScore };
      }
      return p;
    }));
  };

  const triggerFirework = (playerId: number) => {
    const isRound = playerCount === 3 || playerCount === 5;
    const positions = getPlayerPositions(playerCount, isRound);
    const pos = positions[playerId - 1];
    if (pos) {
      setFireworks((prev) => [...prev, { id: fireworkIdRef.current++, position: [pos[0], pos[1] + 1, pos[2]] }]);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleFireworkComplete = (id: number) => setFireworks((prev) => prev.filter((fw) => fw.id !== id));

  const resetGame = () => {
    setPlayers(createPlayers(playerCount));
    resetCamera();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const backToSetup = () => { 
    setGameState('setup'); 
    setPlayers([]); 
    setFireworks([]); 
    resetCamera();
  };


  // 单指拖动 - 旋转视角
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      baseTheta.value = cameraTheta.value;
      basePhi.value = cameraPhi.value;
    })
    .onUpdate((e) => {
      'worklet';
      cameraTheta.value = baseTheta.value - e.translationX * 0.008;
      const newPhi = basePhi.value + e.translationY * 0.005;
      cameraPhi.value = Math.max(MIN_PHI, Math.min(MAX_PHI, newPhi));
    })
    .minPointers(1)
    .maxPointers(1);

  // 双指捏合 - 缩放
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      'worklet';
      baseRadius.value = cameraRadius.value;
    })
    .onUpdate((e) => {
      'worklet';
      const newRadius = baseRadius.value / e.scale;
      cameraRadius.value = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, newRadius));
    });

  // 双指拖动 - 平移
  const twoFingerPan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      baseTargetX.value = cameraTargetX.value;
      baseTargetZ.value = cameraTargetZ.value;
    })
    .onUpdate((e) => {
      'worklet';
      const cosTheta = Math.cos(cameraTheta.value);
      const sinTheta = Math.sin(cameraTheta.value);
      const deltaX = e.translationX * 0.008;
      const deltaZ = e.translationY * 0.008;
      
      const newTargetX = baseTargetX.value - (deltaX * cosTheta + deltaZ * sinTheta);
      const newTargetZ = baseTargetZ.value - (-deltaX * sinTheta + deltaZ * cosTheta);
      
      cameraTargetX.value = Math.max(-MAX_PAN, Math.min(MAX_PAN, newTargetX));
      cameraTargetZ.value = Math.max(-MAX_PAN, Math.min(MAX_PAN, newTargetZ));
    })
    .minPointers(2)
    .maxPointers(2);

  // 组合手势 - 使用 Race 让单指和双指手势互斥
  const composedGesture = Gesture.Race(
    panGesture,
    Gesture.Simultaneous(pinchGesture, twoFingerPan)
  );
  
  // 相机属性
  const cameraProps: CameraControllerProps = {
    theta: cameraTheta,
    phi: cameraPhi,
    radius: cameraRadius,
    targetX: cameraTargetX,
    targetZ: cameraTargetZ,
    onCameraUpdate: updateScreenPositions,
  };

  if (gameState === 'setup') return <SetupScreen onStart={handleStart} />;


  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={styles.canvasContainer}>
          <Suspense fallback={<LoadingFallback />}>
            <Canvas 
              camera={{ position: [0, 4.5, 5.5], fov: 42 }}
              shadows
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            >
              <color attach="background" args={['#0d0505']} />
              <fog attach="fog" args={['#0d0505', 8, 20]} />
              <GameScene 
                playerCount={playerCount}
                animatingCards={animatingCards} 
                fireworks={fireworks} 
                onFireworkComplete={handleFireworkComplete}
                cameraProps={cameraProps}
              />
            </Canvas>
          </Suspense>
        </Animated.View>
      </GestureDetector>

      {/* 分数卡片层 - 跟随3D位置 */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {players.map((player, index) => (
          <PlayerScoreCard 
            key={player.id} 
            player={player} 
            color={PLAYER_COLORS[index]} 
            screenPos={screenPositions[index] || { x: 0, y: 0, visible: false }}
            onScoreChange={handleScoreChange} 
          />
        ))}
      </View>

      {/* 手势提示 */}
      <View style={styles.gestureHint} pointerEvents="none">
        <Text style={styles.gestureHintText}>单指旋转 · 双指缩放/拖动</Text>
      </View>

      <View style={styles.controlBar}>
        <Pressable style={styles.backButton} onPress={backToSetup}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </Pressable>
        <Text style={styles.tipText}>88分触发烟花 🎆</Text>
        <Pressable style={({ pressed }) => [styles.resetButton, { opacity: pressed ? 0.7 : 1 }]} onPress={resetGame}>
          <Text style={styles.resetButtonText}>重置</Text>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0505' },
  canvasContainer: { flex: 1 },
  overlayContainer: { ...StyleSheet.absoluteFillObject, pointerEvents: 'box-none' },
  gestureHint: { 
    position: 'absolute', 
    top: 12, 
    left: 0, 
    right: 0, 
    alignItems: 'center',
    zIndex: 10,
  },
  gestureHintText: { 
    color: 'rgba(255, 200, 100, 0.6)', 
    fontSize: 11, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0505' },
  loadingText: { color: '#ff3333', marginTop: 16, fontSize: 16 },
  setupContainer: { flex: 1, backgroundColor: '#0d0505', justifyContent: 'center', alignItems: 'center', padding: 20 },
  setupTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffd700', marginBottom: 8 },
  setupSubtitle: { fontSize: 18, color: '#ff9999', marginBottom: 40 },
  playerCountOptions: { flexDirection: 'row', gap: 16 },
  countButton: { backgroundColor: '#2a1515', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#ff3333', minWidth: 100 },
  countNumber: { fontSize: 36, fontWeight: 'bold', color: '#ffd700' },
  countLabel: { fontSize: 14, color: '#ff9999', marginTop: 4 },
  countIcon: { fontSize: 24, marginTop: 8 },
  setupHint: { color: '#666', fontSize: 14, marginTop: 40 },
  scoreCard: { 
    position: 'absolute', 
    backgroundColor: 'rgba(20, 10, 10, 0.92)', 
    borderRadius: 10, 
    padding: 6, 
    width: 100,
    alignItems: 'center', 
    borderWidth: 2,
    borderColor: 'rgba(255, 200, 100, 0.3)',
  },
  scoreCardHeader: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, marginBottom: 2 },
  scoreCardName: { color: '#fff', fontSize: 11, fontWeight: '600' },
  scoreCardScore: { fontSize: 26, fontWeight: 'bold', marginVertical: 2 },
  scoreCardButtons: { flexDirection: 'row', gap: 10 },
  scoreBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  minusBtn: { backgroundColor: 'rgba(255,80,80,0.9)' },
  plusBtn: { backgroundColor: 'rgba(80,255,80,0.9)' },
  scoreBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  controlBar: { flexDirection: 'row', backgroundColor: '#1a0a0a', paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255, 51, 51, 0.2)' },
  backButton: { paddingVertical: 8, paddingHorizontal: 12 },
  backButtonText: { color: '#ff9999', fontSize: 14 },
  tipText: { color: '#ffd700', fontSize: 13 },
  resetButton: { backgroundColor: '#ff3333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  resetButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});