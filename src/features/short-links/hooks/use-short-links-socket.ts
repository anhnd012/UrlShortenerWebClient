import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import type { ClickUpdatedEvent } from '../types/short-link.types';

export const useShortLinksSocket = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:11000/ws',
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('✅ Đã kết nối WebSocket thành công tới Backend!');

                client.subscribe('/topic/links', (message) => {
                    if (!message.body) return;
                    // Parse JSON nhận được từ backend
                    const event: ClickUpdatedEvent = JSON.parse(message.body);
                    console.log('📊 Số click vừa cập nhật:', event);
                    // Cập nhật lại cache cho mảng short-links
                    queryClient.setQueryData<any[]>(['short-links'], (oldLinks) => {
                        if (!oldLinks) return oldLinks;
                        // Nếu dữ liệu là Object { urls: [...] }
                        if (oldLinks.urls && Array.isArray(oldLinks.urls)) {
                            return {
                                ...oldLinks,
                                urls: oldLinks.urls.map((link: any) => {
                                    if (link.shortCode === event.shortCode) {
                                        return {
                                            ...link,
                                            numberOfClicks: event.numberOfClicks,
                                        };
                                    }
                                    return link;
                                }),
                            };
                        }
                    });
                });
            },
        })

        client.activate();

        return () => {
            client.deactivate();
            console.log(' Đã ngắt kết nối WebSocket');
        };
    }, [queryClient]);

}