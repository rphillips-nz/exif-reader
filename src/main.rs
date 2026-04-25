use exif::Reader;
use iced::widget::{button, column, container, row, scrollable, text};
use iced::{Alignment, Background, Color, Element, Event, Length, Subscription, Task};
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;

const GAP: u32 = 8;
const GAP_U16: u16 = 8;
const TEXT_COLOR: Color = Color::from_rgb(0.82, 0.843, 0.878);
const BUTTON_SELECTED_BACKGROUND_COLOR: Color = Color::from_rgb8(13, 85, 202);
const BACKGROUND_COLOR: Color = Color::from_rgb(0.196, 0.196, 0.196);
const BACKGROUND_COLOR_DARK: Color = Color::from_rgb(0.1176, 0.1176, 0.1176);
const BORDER_COLOR: Color = Color::from_rgb(0.239, 0.267, 0.302);
const BORDER_WIDTH: f32 = 1.0;

#[derive(Default)]
struct State {
    exif_tags: Vec<(String, String)>,
    files: Vec<PathBuf>,
    selected_file: Option<PathBuf>,
}

#[derive(Debug, Clone)]
enum Message {
    Select(PathBuf),
    FileDropped(PathBuf),
    PickFiles,
    FilesSelected(Vec<PathBuf>),
}

fn cell_style(bg: Color) -> container::Style {
    container::Style::default()
        .background(Background::Color(bg))
        .color(TEXT_COLOR)
}

fn button_style(
    _theme: &iced::Theme,
    _status: iced::widget::button::Status,
) -> iced::widget::button::Style {
    iced::widget::button::Style {
        background: Some(Background::Color(Color::TRANSPARENT)),
        text_color: Color::WHITE,
        ..Default::default()
    }
}

fn selected_button_style(
    _theme: &iced::Theme,
    _status: iced::widget::button::Status,
) -> iced::widget::button::Style {
    iced::widget::button::Style {
        background: Some(Background::Color(BUTTON_SELECTED_BACKGROUND_COLOR)),
        text_color: Color::WHITE,
        ..Default::default()
    }
}

fn horizontal_separator() -> Element<'static, Message> {
    container(text(""))
        .height(BORDER_WIDTH)
        .width(Length::Fill)
        .style(|_| container::Style::default().background(Background::Color(BORDER_COLOR)))
        .into()
}

fn vertical_separator() -> Element<'static, Message> {
    container(text(""))
        .width(BORDER_WIDTH)
        .height(Length::Fill)
        .style(|_| container::Style::default().background(Background::Color(BORDER_COLOR)))
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

            let button = button(text(name))
                .on_press(Message::Select(path.clone()))
                .width(Length::Fill);

            let style = if state.selected_file.as_ref() == Some(path) {
                selected_button_style
            } else {
                button_style
            };

            column![button.style(style), horizontal_separator(),].into()
        })
        .collect();

    let exif_rows: Vec<Element<Message>> = state
        .exif_tags
        .iter()
        .map(|(key, value)| {
            row![
                container(text(key.as_str()))
                    .style(move |_| cell_style(BACKGROUND_COLOR))
                    .padding(GAP_U16),
                container(text(value.as_str()))
                    .style(move |_| cell_style(BACKGROUND_COLOR_DARK))
                    .padding(GAP_U16)
                    .width(Length::Fill),
            ]
            .spacing(BORDER_WIDTH)
            .width(Length::Fill)
            .into()
        })
        .collect();

    let add_button = row![
        button(text("+")).on_press(Message::PickFiles),
        text("Select or drop images")
    ]
    .padding(GAP_U16)
    .spacing(GAP)
    .align_y(Alignment::Center);

    row![
        column![
            add_button,
            horizontal_separator(),
            column(file_buttons).spacing(BORDER_WIDTH),
        ]
        .width(Length::FillPortion(1)),
        vertical_separator(),
        scrollable(column(exif_rows).width(Length::Fill)).width(Length::FillPortion(2))
    ]
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
        Message::Select(path) => {
            state.exif_tags = read_exif(&path);
            state.selected_file = Some(path);
            Task::none()
        }
        Message::FileDropped(path) => {
            if !state.files.contains(&path) {
                state.files.push(path);
            }
            Task::none()
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
        Event::Window(iced::window::Event::FileDropped(path)) => Some(Message::FileDropped(path)),
        _ => None,
    })
}

pub fn main() -> iced::Result {
    iced::application(State::default, update, view)
        .title("Exifiler")
        .subscription(subscription)
        .run()
}
