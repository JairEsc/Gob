from dash import dcc, html, Dash, Input, Output, dash_table
import pandas as pd
import dash_bootstrap_components as dbc
import dash_leaflet as dl
import plotly.express as px



df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminder2007.csv')

app = Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])

# Estilos generales
SIDEBAR_STYLE = {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "width": "16vw",
    "height": "100vh",
    "background-color": "#f8f9fa",
}

CONTENT_STYLE = {
    "margin-left": "16vw",
    "width": "84vw",
}

Leaflet_style = {
    "height": "70vh",
    "width": "84vw",
    "background-color": "rgb(196, 63, 63)",
}

Serie_tiempo_style = {
    "height": "30vh",
    "width": "84vw",
    "background-color": "#f8f9fa",
    "display": "flex"
}
# %%

# Sidebar
sidebar = html.Div(
    [
        html.H2("Visualizador geográfico"),
        html.Hr(),
        html.P("Índice de Complejidad Económica", className="lead"),
        html.Hr(),
        html.P("Selecciona una edición del Directorio Estad...", className="lead"),
        dcc.Dropdown([("DENUE " + str(x) + " A") for x in range(2015, 2024)], "DENUE 2023 A", id='opcion_denue_semestre')
    ],
    style=SIDEBAR_STYLE,
)
df2 = px.data.stocks()
fig = px.line(df2, x='date', y="GOOG")

# Contenido principal

####################Me quedé agregando una serie de tiempo al fondo

content = html.Div(
    id="page-content",
    style=CONTENT_STYLE,
    children=dbc.Container(
        [
            dbc.Row(dl.Map(dl.TileLayer(), center=[20,-98], zoom=8),style={'background-color':'blue','height':'70vh'}),
            dbc.Row(dcc.Graph(figure=fig),style={'background-color':'red','height':'30vh'})
        ],fluid=True
    )
)

# Layout de la aplicación
app.layout = html.Div([dcc.Location(id="url"), sidebar, content])

if __name__ == "__main__":
    app.run_server(debug=True)

