package main

import (
	"shoot/pkg/audience"

	"github.com/tusharsoni/copper/chttp"
	"github.com/tusharsoni/copper/csql"
	"go.uber.org/fx"
)

type Config struct {
	fx.Out

	HTTP     chttp.Config
	SQL      csql.Config
	Audience audience.Config
}

func NewConfig() Config {
	return Config{
		HTTP: chttp.Config{
			Port:       9712,
			HealthPath: "/api/health",
		},
		SQL: csql.Config{
			Host: "localhost",
			Port: 5432,
			Name: "shoot",
			User: "postgres",
		},
		Audience: audience.Config{
			BaseURL: "https://shoot.telab.co/",
		},
	}
}
