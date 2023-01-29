import { natsWrapper } from '@hoangorg/common';

export function configGracefulShutdown() {
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed.');
    // bởi vì nats là thành phần quan trọng nhất của hệ thống. Nếu connection đến nats
    // server bị đóng (có thể là bởi lời gọi hàm close() trong app, hoặc thậm chí là do
    // chính nats server gặp lỗi và bị shutdown cũng dẫn đến sự kiện on('close') này đc gọi)
    // Trong tất cả các trường hợp, chúng ta sẽ shutdown app ngay lập tức vì khi đã bị ngắt
    // kết nối đến nats server, nếu để cho app chạy tiếp thì mọi event phát sinh sau đó sẽ
    // không bao giờ gửi đến nats đc nữa (nats server có khởi động lại thì app cũng ko đc
    // kết nỗi đến nó nữa)
    // Giải pháp tốt nhất là chấp nhận close app ngay lập tức. Kubenetes sẽ chịu trách nhiệm
    // khởi động lại cả nats server và app
    console.log('Closing app...');
    process.exit();
  });

  // khi service bị yêu cầu dừng chạy, thông báo đóng kết nối đến NATS server
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());
}
