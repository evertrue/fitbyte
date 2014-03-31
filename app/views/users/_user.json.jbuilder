json.(user, :id, :name, :slug, :rank, :steps_needed, :steps_needed_per_day, :steps_surplus, :steps, :floors, :avatar_path, :marker_path, :location)
json.min_steps user.steps(:minimum)
json.max_steps user.steps(:maximum)
json.average_steps user.steps(:average).to_f.round

json.min_floors user.floors(:minimum)
json.max_floors user.floors(:maximum)
json.average_floors user.floors(:average).to_f.round
