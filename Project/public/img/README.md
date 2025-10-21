# Изображения для приложения

## Структура папок:

```
public/img/
├── movies/          # Постеры фильмов
│   ├── sherlock-holmes.png
│   ├── kholop.png
│   ├── vozdukh.png
│   └── ...
├── genres/          # Изображения жанров
│   ├── drama.png
│   ├── comedy.png
│   ├── action.png
│   └── ...
└── placeholders/    # Заглушки
    ├── movie-poster.png
    └── genre-default.png
```

## Форматы и размеры:

### Постеры фильмов:
- **Формат**: PNG или JPG
- **Размер**: 300x450px (соотношение 2:3)
- **Названия**: kebab-case (например: sherlock-holmes.png)

### Изображения жанров:
- **Формат**: PNG
- **Размер**: 300x200px (XX:9)
- **Названия**: по названию жанра в kebab-case

### Примеры названий файлов:
- `sherlock-holmes.png`
- `kholop.png`
- `vozdukh.png`
- `drama.png`
- `comedy.png`
- `action.png`
