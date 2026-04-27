use exif::Reader;
use iced::theme::Base;
use iced::widget::{button, column, container, row, scrollable, text};
use iced::{Alignment, Background, Border, Color, Element, Event, Length, Subscription, Task};
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;

const GAP: u32 = 8;
const GAP_U16: u16 = 8;
const BORDER_WIDTH: f32 = 1.0;

#[derive(Clone, Copy)]
struct AppColors {
    text: Color,
    border: Color,
    border_dark: Color,
    text_secondary: Color,
    background_dark: Color,
    background: Color,
    selected_background: Color,
    button_text: Color,
    button_background: Color,
    button_background_active: Color,
    button_border: Color,
}

impl AppColors {
    fn from_theme(theme: &iced::Theme) -> Self {
        match theme.mode() {
            iced::theme::Mode::Dark => Self {
                text: Color::from_rgb8(255, 255, 255),
                border: Color::from_rgb8(85, 85, 85),
                border_dark: Color::from_rgb8(0, 0, 0),
                text_secondary: Color::from_rgb8(170, 170, 170),
                background_dark: Color::from_rgb8(30, 30, 30),
                background: Color::from_rgb8(50, 50, 50),
                selected_background: Color::from_rgb8(13, 86, 202),
                button_background: Color::from_rgb8(110, 110, 110),
                button_background_active: Color::from_rgb8(145, 145, 145),
                button_border: Color::from_rgb8(110, 110, 110),
                button_text: Color::from_rgb8(250, 250, 250),
            },
            _ => Self {
                text: Color::from_rgb8(17, 17, 17),
                border: Color::from_rgb8(213, 213, 213),
                border_dark: Color::from_rgb8(230, 230, 230),
                text_secondary: Color::from_rgb8(119, 119, 119),
                background_dark: Color::from_rgb8(255, 255, 255),
                background: Color::from_rgb8(236, 236, 236),
                selected_background: Color::from_rgb8(16, 103, 222),
                button_background: Color::from_rgb8(255, 255, 255),
                button_background_active: Color::from_rgb8(240, 240, 240),
                button_border: Color::from_rgb8(191, 191, 191),
                button_text: Color::from_rgb8(38, 38, 38),
            },
        }
    }
}

#[derive(Default)]
struct State {
    exif_tags: Vec<(String, String)>,
    files: Vec<PathBuf>,
    selected_file: Option<PathBuf>,
    hovering_count: usize,
}

#[derive(Debug, Clone)]
enum Message {
    Select(PathBuf),
    FileHovered,
    FileDropped(PathBuf),
    FilesHoveredLeft,
    PickFiles,
    FilesSelected(Vec<PathBuf>),
}

fn horizontal_separator() -> Element<'static, Message> {
    container(text(""))
        .height(BORDER_WIDTH)
        .width(Length::Fill)
        .style(|theme: &iced::Theme| {
            let c = AppColors::from_theme(theme);
            container::Style::default().background(Background::Color(c.border))
        })
        .into()
}

fn vertical_separator() -> Element<'static, Message> {
    container(text(""))
        .width(BORDER_WIDTH)
        .height(Length::Fill)
        .style(|theme: &iced::Theme| {
            let c = AppColors::from_theme(theme);
            container::Style::default().background(Background::Color(c.border_dark))
        })
        .into()
}

fn view(state: &State) -> Element<'_, Message> {
    let file_buttons: Vec<Element<Message>> = state
        .files
        .iter()
        .map(|path| {
            let name = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("unknown")
                .to_string();

            let is_selected = state.selected_file.as_ref() == Some(path);

            let btn = button(
                text(name)
                    .width(Length::Fill)
                    .wrapping(text::Wrapping::WordOrGlyph),
            )
            .on_press(Message::Select(path.clone()))
            .width(Length::Fill)
            .padding(GAP_U16)
            .style(move |theme: &iced::Theme, _status| {
                let c = AppColors::from_theme(theme);
                if is_selected {
                    button::Style {
                        background: Some(Background::Color(c.selected_background)),
                        text_color: Color::WHITE,
                        ..Default::default()
                    }
                } else {
                    button::Style {
                        background: Some(Background::Color(Color::TRANSPARENT)),
                        text_color: c.button_text,
                        ..Default::default()
                    }
                }
            });

            column![btn, horizontal_separator()].into()
        })
        .collect();

    let exif_rows: Vec<Element<Message>> = state
        .exif_tags
        .iter()
        .map(|(key, value)| {
            row![
                container(text(key.as_str()).wrapping(text::Wrapping::WordOrGlyph))
                    .style(|theme: &iced::Theme| {
                        let c = AppColors::from_theme(theme);
                        container::Style::default().background(Background::Color(c.background))
                    })
                    .padding(GAP_U16),
                container(text(value.as_str()).wrapping(text::Wrapping::WordOrGlyph))
                    .style(|theme: &iced::Theme| {
                        let c = AppColors::from_theme(theme);
                        container::Style::default().background(Background::Color(c.background_dark))
                    })
                    .padding(GAP_U16)
                    .width(Length::Fill),
            ]
            .spacing(BORDER_WIDTH)
            .width(Length::Fill)
            .into()
        })
        .collect();

    let add_button = row![
        button(text("+").size(iced::Pixels(18.0)).font(iced::Font {
            weight: iced::font::Weight::Bold,
            ..iced::Font::default()
        }))
        .on_press(Message::PickFiles)
        .style(|theme: &iced::Theme, status| {
            let c = AppColors::from_theme(theme);
            let background = match status {
                button::Status::Pressed => c.button_background_active,
                _ => c.button_background,
            };
            button::Style {
                background: Some(Background::Color(background)),
                text_color: c.button_text,
                border: Border {
                    color: c.button_border,
                    width: 1.0,
                    radius: 4.0.into(),
                    ..Default::default()
                },
                ..Default::default()
            }
        })
        .padding(iced::Padding {
            top: 1.0,
            bottom: 1.0,
            left: 10.5,
            right: 10.5,
        }),
        container(text(if state.hovering_count > 0 {
            format!(
                "Drop to add {} image{}",
                state.hovering_count,
                if state.hovering_count == 1 { "" } else { "s" }
            )
        } else {
            "Select or drop images".to_string()
        }))
        .style(|theme: &iced::Theme| {
            let c = AppColors::from_theme(theme);
            container::Style::default().color(c.text_secondary)
        })
    ]
    .padding(GAP_U16)
    .spacing(GAP)
    .align_y(Alignment::Center);

    container(
        row![
            container(
                column![
                    add_button,
                    horizontal_separator(),
                    column(file_buttons).spacing(BORDER_WIDTH),
                ]
                .width(Length::Fill),
            )
            .width(Length::FillPortion(1)),
            vertical_separator(),
            container(
                scrollable(column(exif_rows).width(Length::Fill))
                    .width(Length::Fill)
                    .height(Length::Fill)
            )
            .style(|theme: &iced::Theme| {
                let c = AppColors::from_theme(theme);
                container::Style::default().background(Background::Color(c.background_dark))
            })
            .width(Length::FillPortion(2))
            .height(Length::Fill),
        ]
        .height(Length::Fill),
    )
    .width(Length::Fill)
    .height(Length::Fill)
    .into()
}

fn read_exif(path: &PathBuf) -> Vec<(String, String)> {
    let file = match File::open(path) {
        Ok(f) => f,
        Err(e) => return vec![("Error".to_string(), e.to_string())],
    };
    let exif = match Reader::new().read_from_container(&mut BufReader::new(file)) {
        Ok(e) => e,
        Err(e) => return vec![("Error".to_string(), e.to_string())],
    };
    exif.fields()
        .map(|f| {
            (
                f.tag.to_string(),
                f.display_value().with_unit(&exif).to_string(),
            )
        })
        .collect()
}

fn update(state: &mut State, message: Message) -> Task<Message> {
    match message {
        Message::FileHovered => {
            state.hovering_count += 1;
            Task::none()
        }
        Message::FilesHoveredLeft => {
            state.hovering_count = 0;
            Task::none()
        }
        Message::Select(path) => {
            state.exif_tags = read_exif(&path);
            state.selected_file = Some(path);
            Task::none()
        }
        Message::FileDropped(path) => {
            let is_first = state.hovering_count > 0;
            state.hovering_count = 0;
            if !state.files.contains(&path) {
                state.files.push(path.clone());
            }
            if is_first {
                Task::done(Message::Select(path))
            } else {
                Task::none()
            }
        }
        Message::PickFiles => Task::perform(rfd::AsyncFileDialog::new().pick_files(), |handles| {
            Message::FilesSelected(
                handles
                    .unwrap_or_default()
                    .into_iter()
                    .map(|h| h.path().to_path_buf())
                    .collect(),
            )
        }),
        Message::FilesSelected(paths) => {
            for path in paths {
                if !state.files.contains(&path) {
                    state.files.push(path);
                }
            }
            Task::none()
        }
    }
}

fn subscription(_state: &State) -> Subscription<Message> {
    iced::event::listen_with(|event, _status, _id| match event {
        Event::Window(iced::window::Event::FileHovered(_)) => Some(Message::FileHovered),
        Event::Window(iced::window::Event::FilesHoveredLeft) => Some(Message::FilesHoveredLeft),
        Event::Window(iced::window::Event::FileDropped(path)) => Some(Message::FileDropped(path)),
        _ => None,
    })
}

pub fn main() -> iced::Result {
    iced::application(State::default, update, view)
        .title("Exifiler")
        .style(|_state, theme| {
            let c = AppColors::from_theme(theme);
            iced::theme::Style {
                background_color: c.background,
                text_color: c.text,
            }
        })
        .settings(iced::Settings {
            default_font: iced::Font {
                family: iced::font::Family::SansSerif,
                ..iced::Font::default()
            },
            default_text_size: iced::Pixels(13.0),
            ..iced::Settings::default()
        })
        .subscription(subscription)
        .run()
}
