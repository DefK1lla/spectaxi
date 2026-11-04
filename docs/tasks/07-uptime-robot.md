# Задача: UptimeRobot на /ready

**Зачем:** узнать, что API недоступен, без своего агента на сервере.

## Что сделать

- [ ] Аккаунт [UptimeRobot](https://uptimerobot.com) Free
- [ ] HTTP(S) monitor → `https://<host>/api/v1/ready`
- [ ] Ожидание: статус **200**
- [ ] Алерт: Telegram или email

Liveness для отладки процесса: `/api/v1/health` (без проверки БД). Внешний пинг — именно **ready**.
