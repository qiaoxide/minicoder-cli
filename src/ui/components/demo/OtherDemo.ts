import {
    MessageBox, Success, Error, Warning, Info,
    KeyValue, KeyValueList, KeyValueStatus,
    Header, Divider, BoxHeader,
} from '../index.js';

export const printOtherUIDemo = () => {
    // 消息框
    MessageBox("默认消息")
    Success('操作成功', '完成');
    Error('连接失败', '错误');
    Warning('磁盘空间不足', '警告');
    Info('新版本可用', '提示');

    // 键值对
    KeyValue('API Key', '✓ 已配置');
    KeyValueList({ Model: 'gemini-2.0', Proxy: 'http://127.0.0.1:7890' });
    KeyValueStatus('API Key', '已配置', true);

    // 区块头部
    Header('配置摘要');
    BoxHeader('MiniCoder 配置', '设置你的 API Key');

    // 分隔线
    Divider();


}
