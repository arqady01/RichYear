/**
 * 亲戚关系计算器数据
 * Kinship Calculator Data for Chinese Family Relationships
 */

// 关系按钮定义
export interface RelationButton {
  id: string;
  label: string;
  shortLabel?: string;
}

// 关系分类
export interface RelationCategory {
  title: string;
  relations: RelationButton[];
}

// 按钮分类
export const RELATION_CATEGORIES: RelationCategory[] = [
  {
    title: '长辈',
    relations: [
      { id: 'f', label: '爸爸', shortLabel: '爸' },
      { id: 'm', label: '妈妈', shortLabel: '妈' },
    ],
  },
  {
    title: '平辈',
    relations: [
      { id: 'ob', label: '哥哥', shortLabel: '兄' },
      { id: 'lb', label: '弟弟', shortLabel: '弟' },
      { id: 'os', label: '姐姐', shortLabel: '姐' },
      { id: 'ls', label: '妹妹', shortLabel: '妹' },
    ],
  },
  {
    title: '晚辈',
    relations: [
      { id: 's', label: '儿子', shortLabel: '子' },
      { id: 'd', label: '女儿', shortLabel: '女' },
    ],
  },
  {
    title: '配偶',
    relations: [
      { id: 'h', label: '丈夫', shortLabel: '夫' },
      { id: 'w', label: '妻子', shortLabel: '妻' },
    ],
  },
];

// 所有关系按钮的扁平列表
export const ALL_RELATIONS: RelationButton[] = RELATION_CATEGORIES.flatMap(
  (cat) => cat.relations
);

// 关系链到称呼的映射表
// 使用关系ID组成的路径作为键，称呼作为值
const KINSHIP_MAP: Record<string, string> = {
  // 自己
  '': '自己',
  
  // 一级关系
  'f': '爸爸',
  'm': '妈妈',
  'h': '丈夫',
  'w': '妻子',
  's': '儿子',
  'd': '女儿',
  'ob': '哥哥',
  'lb': '弟弟',
  'os': '姐姐',
  'ls': '妹妹',
  
  // 爸爸系列
  'f,f': '爷爷',
  'f,m': '奶奶',
  'f,ob': '伯父',
  'f,lb': '叔叔',
  'f,os': '姑妈',
  'f,ls': '姑姑',
  'f,f,f': '曾祖父',
  'f,f,m': '曾祖母',
  'f,m,f': '曾外祖父',
  'f,m,m': '曾外祖母',
  'f,ob,s': '堂哥',
  'f,ob,d': '堂姐',
  'f,lb,s': '堂弟',
  'f,lb,d': '堂妹',
  'f,os,s': '表哥',
  'f,os,d': '表姐',
  'f,ls,s': '表弟',
  'f,ls,d': '表妹',
  'f,ob,w': '伯母',
  'f,lb,w': '婶婶',
  'f,os,h': '姑父',
  'f,ls,h': '姑父',
  
  // 妈妈系列
  'm,f': '外公',
  'm,m': '外婆',
  'm,ob': '大舅',
  'm,lb': '舅舅',
  'm,os': '大姨',
  'm,ls': '小姨',
  'm,f,f': '曾外祖父',
  'm,f,m': '曾外祖母',
  'm,m,f': '外曾外祖父',
  'm,m,m': '外曾外祖母',
  'm,ob,s': '表哥',
  'm,ob,d': '表姐',
  'm,lb,s': '表弟',
  'm,lb,d': '表妹',
  'm,os,s': '表哥',
  'm,os,d': '表姐',
  'm,ls,s': '表弟',
  'm,ls,d': '表妹',
  'm,ob,w': '舅妈',
  'm,lb,w': '舅妈',
  'm,os,h': '姨父',
  'm,ls,h': '姨父',
  
  // 儿子系列
  's,s': '孙子',
  's,d': '孙女',
  's,w': '儿媳妇',
  's,s,s': '曾孙',
  's,s,d': '曾孙女',
  's,d,s': '曾外孙',
  's,d,d': '曾外孙女',
  
  // 女儿系列
  'd,s': '外孙',
  'd,d': '外孙女',
  'd,h': '女婿',
  'd,s,s': '曾外孙',
  'd,s,d': '曾外孙女',
  'd,d,s': '外曾外孙',
  'd,d,d': '外曾外孙女',
  
  // 哥哥系列
  'ob,w': '嫂子',
  'ob,s': '侄子',
  'ob,d': '侄女',
  
  // 弟弟系列
  'lb,w': '弟妹',
  'lb,s': '侄子',
  'lb,d': '侄女',
  
  // 姐姐系列
  'os,h': '姐夫',
  'os,s': '外甥',
  'os,d': '外甥女',
  
  // 妹妹系列
  'ls,h': '妹夫',
  'ls,s': '外甥',
  'ls,d': '外甥女',
  
  // 丈夫系列
  'h,f': '公公',
  'h,m': '婆婆',
  'h,ob': '大伯子',
  'h,lb': '小叔子',
  'h,os': '大姑子',
  'h,ls': '小姑子',
  'h,f,f': '爷爷',
  'h,f,m': '奶奶',
  'h,m,f': '外公',
  'h,m,m': '外婆',
  
  // 妻子系列
  'w,f': '岳父',
  'w,m': '岳母',
  'w,ob': '大舅子',
  'w,lb': '小舅子',
  'w,os': '大姨子',
  'w,ls': '小姨子',
  'w,f,f': '岳祖父',
  'w,f,m': '岳祖母',
  'w,m,f': '岳外祖父',
  'w,m,m': '岳外祖母',
  
  // 更多复杂关系
  'f,f,ob': '伯公',
  'f,f,lb': '叔公',
  'f,f,os': '姑婆',
  'f,f,ls': '姑婆',
  'f,m,ob': '舅公',
  'f,m,lb': '舅公',
  'f,m,os': '姨婆',
  'f,m,ls': '姨婆',
  'm,f,ob': '舅公',
  'm,f,lb': '舅公',
  'm,f,os': '姨婆',
  'm,f,ls': '姨婆',
  'm,m,ob': '舅姥爷',
  'm,m,lb': '舅姥爷',
  'm,m,os': '姨姥姥',
  'm,m,ls': '姨姥姥',
  
  // 堂表亲的子女
  'f,ob,s,s': '堂侄',
  'f,ob,s,d': '堂侄女',
  'f,ob,d,s': '表外甥',
  'f,ob,d,d': '表外甥女',
  'f,lb,s,s': '堂侄',
  'f,lb,s,d': '堂侄女',
  'f,lb,d,s': '表外甥',
  'f,lb,d,d': '表外甥女',
  
  // 配偶的兄弟姐妹的配偶
  'h,ob,w': '大伯母',
  'h,lb,w': '小婶子',
  'h,os,h': '姑爷',
  'h,ls,h': '姑爷',
  'w,ob,w': '舅嫂',
  'w,lb,w': '舅弟妹',
  'w,os,h': '襟兄',
  'w,ls,h': '襟弟',
};

/**
 * 计算亲戚称呼
 * @param relationIds 关系ID数组
 * @returns 称呼结果
 */
export function calculateKinship(relationIds: string[]): string {
  if (relationIds.length === 0) {
    return '请选择关系';
  }
  
  const key = relationIds.join(',');
  const result = KINSHIP_MAP[key];
  
  if (result) {
    return result;
  }
  
  // 尝试简化或给出近似结果
  return '关系较复杂，请简化';
}

/**
 * 获取关系链的文字描述
 * @param relationIds 关系ID数组
 * @returns 关系链描述
 */
export function getRelationChainText(relationIds: string[]): string {
  if (relationIds.length === 0) {
    return '点击下方按钮添加关系';
  }
  
  return relationIds
    .map((id) => {
      const relation = ALL_RELATIONS.find((r) => r.id === id);
      return relation ? relation.label : id;
    })
    .join(' 的 ');
}

/**
 * 获取关系链的简短描述
 * @param relationIds 关系ID数组
 * @returns 简短关系链描述
 */
export function getRelationChainShort(relationIds: string[]): string {
  if (relationIds.length === 0) {
    return '';
  }
  
  return relationIds
    .map((id) => {
      const relation = ALL_RELATIONS.find((r) => r.id === id);
      return relation?.shortLabel || relation?.label || id;
    })
    .join('→');
}
